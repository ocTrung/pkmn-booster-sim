import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

import CardTray from '../../components/CardTray'
import RarityInputForm from '../../components/RarityInputForm'
import { getRarityList, pickNonRareCards, pickRareCard, round100 } from '../../utils/packOpener'
import styles from '../../styles/Set.module.scss'
import probabilityData from '../../suggestedProbabilities.json'

export default function Sets({ cardsfromSet }) {
	const [rareTypes, setRareTypes] = useState(null)
	const [pack, setPack] = useState(null)
	const [totalOpened, setTotalOpened] = useState(0)
	const router = useRouter()
	const { setid, setname } = router.query

	const totalChance = rareTypes?.reduce((acc, type) => typeof type.chance === 'number' ? acc + type.chance : total, 0)
	const buttonDisabled = Math.ceil(totalChance) !== 100;

	// Initialize rare types
	useEffect(() => {
		let newRareTypes = null

		if (cardsfromSet.length > 0) {
			newRareTypes = getRarityList(cardsfromSet)
		}
		if (setid === window.localStorage.setid) {
			newRareTypes.forEach(t => {
				const rarityName = t.rarityName
				const rareTypefromStorage = JSON.parse(window.localStorage.getItem(rarityName))
				t.chance = rareTypefromStorage.chance
			})
		}
		else {
			window.localStorage.clear()

			// If currently viewed set is not the same set we viewed previously, 
			// check if the set is included in file with suggested probability distribution data
			if (Object.hasOwn(probabilityData, setid)) {
				newRareTypes.forEach(t => {
					const rarityName = t.rarityName
					const chance = probabilityData[setid][rarityName]
					t.chance = chance
				})
			}
		}
		setRareTypes(newRareTypes)
	}, [cardsfromSet])

	// Save rarity chances to local storage
	useEffect(() => {
		if (rareTypes) {
			rareTypes.forEach(type => {
				window.localStorage.setItem(type.rarityName, JSON.stringify(type))
			})
		}
		window.localStorage.setItem('setid', setid)
	})

	const handleProbabilityChange = (e) => {
		let newChanceVal = round100(parseFloat(e.target.value))
		const inputRarity = e.target.id

		const newRareTypes = rareTypes.map(r => {
			if (r.rarityName === inputRarity) 
				return {rarityName: inputRarity, chance: newChanceVal}
			else 
				return r
		})

		setRareTypes(newRareTypes)
	}

	const handleGeneratePack = () => {
		setTotalOpened(totalOpened + 1)
		
		let newPack = [
			...pickNonRareCards('common', cardsfromSet),
			...pickNonRareCards('uncommon', cardsfromSet),
			pickRareCard(cardsfromSet, rareTypes)
		]
		setPack(newPack)
	}

	return (
		<>
			<Head>
				<title>{setname}</title>
				<meta name="description" content="Pokemon booster pack simulator" key='ogMeta'/>
				<link rel="icon" href="/250 Ho-oh.ico" key='ogIcon'/>
			</Head>
			<header className={styles.header}>
				<RarityInputForm 
					rareTypes={ rareTypes } 
					handleChange={ handleProbabilityChange }
					totalRolls={ totalOpened }
					handleGeneratePack={ handleGeneratePack }
					totalChance={ totalChance }
				/>
				<details className={styles.details} open>
					<summary className={styles.summary}>How to use</summary>
					Some featured sets will have suggested probabilities for rares. There is 1 guaranteed 
					rare per pack. Users can customize the 'rare' probability distribution using the panel 
					on the left. Input accepts up to 2 decimal places. Enjoy!
				</details>
			</header>
			<button
				className={ styles.genPackBtn }
				onClick={ handleGeneratePack } 
				disabled={ buttonDisabled }
			>
				open new pack
			</button>
			{ pack?.length > 0 && 
				<CardTray pack={pack} totalRolls={totalOpened} /> 
			}
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
	const cardsfromSet = data.data

	return {
		props: { cardsfromSet }
	}
}