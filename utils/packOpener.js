function getRarityList(cards) {
	const newRarities = []
	
	for (const c of cards) {
		const hasAddedRarity = newRarities.find(added => added.rarityName === c.rarity) !== undefined

		if (hasAddedRarity || c.rarity === 'Common' || c.rarity === 'Uncommon')
			continue
		else
			newRarities.push({rarityName: c.rarity, chance: 0})
	}

	return newRarities
}

function pickNonRareCards(rarityName, cards) {
	let picks = []
	let total = null
	let cardPool = []

	// how many cards to add
	switch (rarityName) {
		case 'common':
			total = 6
			cardPool = cards.filter(c => c.rarity.toLowerCase() === 'common')
			break
		case 'uncommon':
			total = 3
			cardPool = cards.filter(c => c.rarity.toLowerCase() === 'uncommon')
			break
	}

	for (let i = 0; i < total; i++) {
		let randIndex = Math.floor(Math.random() * cardPool.length)
		while(picks.includes(cardPool[randIndex]) || cardPool[randIndex].supertype === 'Energy') {
			randIndex = Math.floor(Math.random() * cardPool.length)
		}
		picks.push(cardPool[randIndex])
	}

	return picks
}

function pickRareCard(cards, userRareVals) {
	let currRareType =  getRareTypeforPack(userRareVals)
	console.log('rare-type:', currRareType)

	const rareCards = cards.filter(c => {
		return c.rarity.toLowerCase() !== 'uncommon' && c.rarity.toLowerCase() !== 'common'
	})
	
	let randIndex = Math.floor(Math.random() * rareCards.length)

	// check if randomly picked card's type === rare type for pack
	while (rareCards[randIndex].rarity.toLowerCase() !== currRareType.toLowerCase()) {
		randIndex = Math.floor(Math.random() * rareCards.length)
	}

	return rareCards[randIndex]
}

function getRareTypeforPack(userRareVals) {
	if (!userRareVals)
		return undefined

	let rangeList = []
	let rangePrototype = {
		rarityName: '', 
		range: {start: 0, end: 0}
	}

	// set up range for each Rare Val
	let i = 0.0
	userRareVals.forEach(({rarityName, chance}, index) => {
		const newRangeObj = Object.create(rangePrototype)
		newRangeObj.rarityName = rarityName
		newRangeObj.range = {
			start: i, 
			end: index < userRareVals.length - 1 ? round100(chance + i) : 100
		}
		rangeList.push(newRangeObj)
		i = round100(newRangeObj.range.end + 0.01)
	})

	const randFloat = (Math.random() * 100).toFixed(2)
	let chosenRarity = null

	// Check what range the random number is in
	for (const {rarityName, range} of rangeList) {
		if (randFloat >= range.start && randFloat <= range.end) {
			chosenRarity = rarityName
			break
		}
	}

	if (chosenRarity === null) {
		console.log('randfloat', randFloat)
		console.log(rangeList)
	}
	return chosenRarity
}

function round100(num) {
	return parseFloat(num.toFixed(2))
}

export { getRarityList, pickNonRareCards, pickRareCard, round100 }