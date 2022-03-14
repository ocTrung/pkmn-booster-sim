import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'

export default function Sets(props) {
    const [cards, setCards] = useState(() => props.cards)
    const [rareTypes, setRareTypes] = useState(null)
    const [pack, setPack] = useState(null)
    const [totalRarityProb, setTotalRarityProb] = useState(0)
    const [totalRolls, setTotalRolls] = useState(0)
    
    const formRef = useRef()
    const router = useRouter()
    const { setid } = router.query

    const rareTypesList = rareTypes === null ? null : Object.keys(rareTypes)

    function handleGeneratePack() {
        const rarityInputElements = formRef.current.elements
        const userRareVals = {}
        for (const e of rarityInputElements) {
            userRareVals[e.id] = parseInt(e.value, 10)
        }

        const outcomesList = Object.values(userRareVals)
        const total = outcomesList.reduce((pv, cv) => pv + cv)
        if (total !== 100)
            throw 'rarity values must total 100'

        setTotalRolls(totalRolls + 1)
        const commonsFromPack = []
        const uncommonsFromPack = []
        const raresFromPack = []
        let pack = []

    
        for (const c of cards) {
            const cardRarity = c.rarity.toLowerCase()
    
            switch (cardRarity) {
                case 'common':
                    commonsFromPack.push(c)
                    break
                case 'uncommon':
                    uncommonsFromPack.push(c)
                    break
                default:
                    raresFromPack.push(c)
            }
        }
    
        pack.push(...pickNonRareCards('common', commonsFromPack))
        pack.push(...pickNonRareCards('uncommon', uncommonsFromPack))
        pack.push(pickRareCard(raresFromPack, userRareVals))
    
        setPack(pack)
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
        setTotalRarityProb(totalFavorableValue)
    }

    return (
        <>
            <form ref={formRef}>
                {rareTypes && rareTypesList.map(rarity => {
                    return (
                        <div>
                            <label htmlFor={rarity}>{rarity} </label>
                            <input type='text' id={rarity} onChange={handleChange} defaultValue={0}></input>
                        </div>
                    )
                })}
            </form>
            points left: {100 - totalRarityProb}
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
    let currRareType = null

    // how many cards to add
    switch (rarity) {
        case 'common':
            total = 7
            break
        case 'uncommon':
            total = 3
            break
    }

    for (let i = 0; i < total; i++) {
        let randIndex = Math.floor(Math.random() * cards.length)
        while(picks.includes(cards[randIndex]) || cards[randIndex].supertype === 'Energy') {
            randIndex = Math.floor(Math.random() * cards.length)
        }
        picks.push(cards[randIndex])
    }

    return picks
}

function pickRareCard(cards, userRareVals = {}) {
    let currRareType =  getRareTypeforPack(userRareVals)
    console.log('rare-type:', currRareType)
    let randIndex = Math.floor(Math.random() * cards.length)
    const rareCards = cards.filter(c => {
        return c.rarity.toLowerCase() !== 'uncommon' && c.rarity.toLowerCase() !== 'common'
    })

    while (rareCards[randIndex].rarity.toLowerCase() !== currRareType.toLowerCase()) {
        randIndex = Math.floor(Math.random() * cards.length)
    }

    return rareCards[randIndex]
}

function getRareTypeforPack(userRareVals) {
    if (!userRareVals)
    return

    const roulette = new Array(100)
    let i = 0

    for (const [rarityType, favorableOutcome] of Object.entries(userRareVals)) {
        let start = i

        while (i < start + favorableOutcome) {
            roulette[i] = rarityType
            i++
        }
    }
    console.log(roulette)

    const randIndex = Math.floor(Math.random() * 100)

    return roulette[randIndex]
    }