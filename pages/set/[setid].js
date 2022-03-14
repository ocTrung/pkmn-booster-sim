import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'

export default function Sets(props) {
    const [cards, setCards] = useState(() => props.cards)
    const [rareTypes, setRareTypes] = useState(null)
    const [pack, setPack] = useState(null)
    const [totalRarityOutcomes, setTotalRarityOutcomes] = useState(0)
    const [totalRolls, setTotalRolls] = useState(0)
    
    const formRef = useRef()
    const router = useRouter()
    const { setid } = router.query

    const rareTypesList = rareTypes === null ? null : Object.keys(rareTypes)
    let t0 = null
    
    function handleGeneratePack() {
        // for benchmarking
        t0 = performance.now()
        
        // Get rare probabilities from user input
        const userRareVals = {}
        const rarityInputElements = formRef.current.elements
        for (const e of rarityInputElements) {
            userRareVals[e.id] = parseInt(e.value, 10)
        }

        // temporary error handling for invalid probability
        const outcomesList = Object.values(userRareVals)
        const total = outcomesList.reduce((pv, cv) => pv + cv)
        if (total !== 100)
            throw 'rarity values must total 100'

        setTotalRolls(totalRolls + 1)
        let pack = []
    
        pack.push(...pickNonRareCards('common', cards))
        pack.push(...pickNonRareCards('uncommon', cards))
        pack.push(pickRareCard(cards, userRareVals))
        setPack(pack)

        // for benchmarking
        const t1 = performance.now();
        console.log(`Call to handleGeneratePack took ${t1 - t0} milliseconds.`);
    }

    useEffect(() => {
        if (cards.length > 0) {
            setRareTypes(getRarityList(cards))
        }
    }, [cards])
    
    const handleChange = () => {
        const totalFavorableValue = 0
        const rarityInputElements = formRef.current.elements
        for (const e of rarityInputElements) {
            totalFavorableValue += parseInt(e.value, 10)
        }
        setTotalRarityOutcomes(totalFavorableValue)
    }

    return (
        <>
            <form ref={formRef}>
                {rareTypes && rareTypesList.map(rarity => {
                    return (
                        <div key={rarity}>
                            <label htmlFor={rarity}>{rarity} </label>
                            <input type='text' id={rarity} onChange={handleChange} defaultValue={0}></input>
                        </div>
                    )
                })}
            </form>
            points left: {100 - totalRarityOutcomes}
            <br></br>
            packs opened: {totalRolls}
            <br></br>
            <button onClick={() => handleGeneratePack()}>generate pack</button>
            <br></br>
            {pack?.length > 0 && pack.map(c => <img key={c.id} src={c.images.small} alt={c.id}></img>)}
        </>
    )
}

export async function getStaticPaths() {
    const res = await fetch('https://api.pokemontcg.io/v2/sets')
    const data = await res.json()
    const sets = data.data

    const setIds = sets.map(s => {
        return { params: { setid: s.id } }
    })
    return {
      paths: setIds,
      fallback: false
    };
  }

export async function getStaticProps({ params }) {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${params.setid}`)
    const data = await res.json()
    const cards = data.data

    return {
        props: { cards }
    }
}

function getRarityList(cards) {
    const newRarities = {}
    
    for (const c of cards) {
        if (Object.hasOwn(newRarities, c.rarity) || c.rarity === 'Common' || c.rarity === 'Uncommon')
            continue
        else
            newRarities[c.rarity] = 0
    }

    return newRarities
}

function pickNonRareCards(rarity, cards, userRareVals = {}) {
    let picks = []
    let total = null
    let cardPool = []

    // how many cards to add
    switch (rarity) {
        case 'common':
            total = 7
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

function pickRareCard(cards, userRareVals = {}) {
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

    for (const [rarityType, favorableOutcomes] of Object.entries(userRareVals)) {
        let start = i

        while (i < start + favorableOutcomes) {
            roulette[i] = rarityType
            i++
        }
    }

    const randIndex = Math.floor(Math.random() * 100)

    return roulette[randIndex]
}