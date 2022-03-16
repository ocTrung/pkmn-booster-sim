import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import BoosterPack from '../../components/BoosterPack'
import RarityInputForm from '../../components/RarityInputForm'
import { getRarityList, pickNonRareCards, pickRareCard } from '../utils'
import styles from '../../styles/Set.module.css'

export default function Sets({ cards: cardsfromSet }) {
	const [rareTypes, setRareTypes] = useState(null)
	const [pack, setPack] = useState(null)
	const [totalRolls, setTotalRolls] = useState(0)
	const router = useRouter()
	const { setid } = router.query

	
	function handleGeneratePack() {
		// for benchmarking
		let t0 = performance.now()

		// temporary error handling for invalid probability
		const total = rareTypes.reduce((pv, cv) => cv.favorableOutcomes + pv, 0)
		if (total !== 100)
			throw 'rarity values must total 100'

		setTotalRolls(totalRolls + 1)
		let newPack = []
	
		newPack.push(...pickNonRareCards('common', cardsfromSet))
		newPack.push(...pickNonRareCards('uncommon', cardsfromSet))
		newPack.push(pickRareCard(cardsfromSet, rareTypes))
		setPack(newPack)

		// for benchmarking
		const t1 = performance.now();
		console.log(`Call to handleGeneratePack took ${t1 - t0} milliseconds.`);
	}

	// set rareTypes
	useEffect(() => {
		let newRareTypes = null

		if (cardsfromSet.length > 0) {
			newRareTypes = getRarityList(cardsfromSet)
		}
		if (setid === window.localStorage.setid) {
			newRareTypes.forEach(t => {
				const rarityName = t.rarity
				const rareTypefromStorage = JSON.parse(window.localStorage.getItem(rarityName))
				t.favorableOutcomes = rareTypefromStorage.favorableOutcomes
			})
		}
		else {
			window.localStorage.clear()
		}
		setRareTypes(newRareTypes)
	}, [cardsfromSet])

	// save rarity outcomes to local storage
	useEffect(() => {
		if (rareTypes) {
			rareTypes.forEach(type => {
				window.localStorage.setItem(type.rarity, JSON.stringify(type))
			})
		}
		window.localStorage.setItem('setid', setid)
	})

	const handleOutcomeInputChange = (e) => {
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


	return (
		<>
			<RarityInputForm rareTypes={ rareTypes } handleChange={ handleOutcomeInputChange }></RarityInputForm>
	
			<p>packs opened: {totalRolls}</p>

			<button className={styles.genPackBtn} onClick={() => handleGeneratePack()}>generate pack</button>

			{ pack?.length > 0 && <BoosterPack pack={pack}></BoosterPack> }
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