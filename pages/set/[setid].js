import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'

export default function Sets(props) {
    const [cards, setCards] = useState(() => props.cards)
    const [rareTypes, setRareTypes] = useState(() => {
        const isWindow = typeof window
        if (typeof window !== 'undefined') {
            const storedRareTypes = []
            const keys = Object.keys(window.localStorage)
            keys = keys.filter(k => k != 'setid')

            keys.forEach(k => {
                const val = JSON.parse(window.localStorage.getItem(k))
                storedRareTypes.push(val)
            })
            return storedRareTypes || null
        }
        return null
    })
    // const [rareTypes, setRareTypes] = useState(null)
    const [pack, setPack] = useState(null)
    const [totalRarityOutcomes, setTotalRarityOutcomes] = useState(0)
    const [totalRolls, setTotalRolls] = useState(0)
    
    const formRef = useRef()
    const router = useRouter()
    const { setid } = router.query

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

    // initialize rareTypes
    useEffect(() => {
        if (cards.length > 0 && window.localStorage.length === 0 || window.localStorage.setid !== setid) {
            console.log('initializer effect ran')
            setRareTypes(getRarityList(cards))
        }
    }, [cards])

    useEffect(() => {
        console.log('storage effect ran')
        if (rareTypes) {
            rareTypes.forEach(type => {
                window.localStorage.setItem(type.rarity, JSON.stringify(type))
            })
        }
        window.localStorage.setItem('setid', setid)
    })
    
    const handleChange = (e) => {
        const inputRarity = e.target.id
        const outcomes = parseInt(e.target.value)

        const newRareTypes = rareTypes.map(r => {
            if (r.rarity === inputRarity)
                return {rarity: inputRarity, favorableOutcomes: outcomes}
            else
                return r
        })

        setRareTypes(newRareTypes)
    }

    let totalFavorableOutcomes = rareTypes ? rareTypes.reduce((pv, cv) => cv.favorableOutcomes + pv, 0) : 0

    return (
        <>
            <form ref={formRef}>
                {rareTypes && rareTypes.map(r => {
                    return (
                        <div key={r.rarity}>
                            <label htmlFor={r.rarity}>{r.rarity} </label>
                            <input 
                                type='text' 
                                id={r.rarity} 
                                onChange={handleChange} 
                                value={rareTypes.find(el => el.rarity === r.rarity).favorableOutcomes}>
                            </input>
                        </div>
                    )
                })}
            </form>
            points left: {100 - totalFavorableOutcomes}
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
    const newRarities = []
    
    for (const c of cards) {
        const hasAddedRarity = newRarities.find(e => e.rarity === c.rarity) !== undefined
        if (hasAddedRarity || c.rarity === 'Common' || c.rarity === 'Uncommon')
            continue
        else
            newRarities.push({rarity: c.rarity, favorableOutcomes: 0})
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