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

function pickNonRareCards(rarityName, cards, userRareVals = {}) {
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
	return

	const roulette = new Array(100)
	let i = 0

	for (const {rarityName, chance} of userRareVals) {
		let start = i

		while (i < start + chance) {
			roulette[i] = rarityName
			i++
		}
	}

	const randIndex = Math.floor(Math.random() * 100)

	return roulette[randIndex]
}

export { getRarityList, pickNonRareCards, pickRareCard }