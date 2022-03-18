import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import BoosterPack from '../../components/BoosterPack'
import RarityInputForm from '../../components/RarityInputForm'
import { getRarityList, pickNonRareCards, pickRareCard } from '../utils'
import styles from '../../styles/Set.module.css'

export default function Sets({ cards: cardsfromSet }) {
	const [rareTypes, setRareTypes] = useState(null)
	const [pack, setPack] = useState(null)
	const [totalRolls, setTotalRolls] = useState(0)
	const [longPage, setLongPage] = useState(false)

	const bottomDivRef = useRef()
	const genPackBtnRef = useRef()
	const router = useRouter()
	const { setid, setname } = router.query

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

	const handleProbabilityChange = (e) => {
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

	// useEffect(()=> {
	// 	window.onscroll = () => {
	// 		if (window.scrollY > 400)
	// 			setUserAtTop(false)
	// 		else
	// 			setUserAtTop(true)
	// 	}
	// }, [])

	useEffect(()=> {
		// console.log(document.body.clientHeight)
		// if (document.body.clientHeight > 700)
		// 	console.log('page is long')
		// else
		// 	console.log('page is fine')
		window.addEventListener('resize', ()=> {
			if(document.body.clientHeight > 1000)
				setLongPage(true)
			else
			setLongPage(false)
		})
	})
	console.log('rendered')

	
	
	return (
		<>
			<Head>
				<title>{setname}</title>
				<meta name="description" content="Pokemon booster pack simulator" key='ogMeta'/>
				<link rel="icon" href="/250 Ho-oh.ico" key='ogIcon'/>
			</Head>
			<RarityInputForm rareTypes={ rareTypes } handleChange={ handleProbabilityChange }></RarityInputForm>
	
			<p>packs opened: {totalRolls}</p>

			<button className={styles.genPackBtn} onClick={() => handleGeneratePack()} ref={ genPackBtnRef }>generate pack</button>
			{ longPage && <button className={styles.genPackBtn} onClick={() => bottomDivRef.current.scrollIntoView()}>jump to rare</button> }

			{ pack?.length > 0 && <BoosterPack pack={pack} totalRolls={totalRolls}></BoosterPack> }
			
			{ longPage && <button className={styles.goToTop} onClick={() => window.scrollTo(0,0)}>go to top</button> }
			<div ref={ bottomDivRef } id='bottomDiv'></div>
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