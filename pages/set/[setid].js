import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'

export default function Sets(props) {
    const [cards, setCards] = useState(() => props.cards)
    const [rareTypes, setRareTypes] = useState(null)
    const [pack, setPack] = useState(null)
    const router = useRouter()
    const { setid } = router.query

    function generatePack() {
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
    
        pack.push(...pickCards('common', commonsFromPack))
        pack.push(...pickCards('uncommon', uncommonsFromPack))
        pack.push(...pickCards('rare', raresFromPack))
    
        setPack(pack)
    }

    useEffect(() => {
        if (cards.length > 0) {
            setRareTypes(getRarityList(cards))
        }
    }, [cards])

    return (
        <>
            Rare Types:
            <ul>
                {rareTypes && rareTypes.map(rarity => {
                    return (
                        <li>
                            {rarity}
                        </li>
                    )
                })}
            </ul>
            <br></br>
            <button onClick={() => generatePack()}>generate pack</button>
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
        if (newRarities.includes(c.rarity) || c.rarity === 'Common' || c.rarity === 'Uncommon')
            continue
        else
            newRarities.push(c.rarity)
    }
    console.log(newRarities)

    return newRarities
}

function pickCards(rarity, cards) {
    let picks = []
    let total = null

    switch (rarity) {
        case 'common':
            total = 7
            break
        case 'uncommon':
            total = 3
            break
        default:
            total = 1
    }

    for (let i = 0; i < total; i++) {
        let randIndex = Math.floor(Math.random() * cards.length)
        const rareHoloProbability = 1/3

        const isHoloPack = Math.floor(Math.random * 3) === 0

        while(picks.includes(cards[randIndex]) || cards[randIndex].supertype === 'Energy') {
            randIndex = Math.floor(Math.random() * cards.length)
        }

        picks.push(cards[randIndex])
    }

    return picks
}