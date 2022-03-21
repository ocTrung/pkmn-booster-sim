import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

import CardTray from '../../components/CardTray'
import RarityInputForm from '../../components/RarityInputForm'
import { getRarityList, pickNonRareCards, pickRareCard } from '../../utils/packOpener'
import styles from '../../styles/Set.module.scss'
import probabilityData from '../../suggestedProbabilities.json'

export default function Sets({ cardsfromSet }) {
	const [rareTypes, setRareTypes] = useState(null)
	const [pack, setPack] = useState(null)
	const [totalRolls, setTotalRolls] = useState(0)
	// const [isLongPage, setIsLongPage] = useState(false)

	const router = useRouter()
	const { setid, setname } = router.query
	const bottomDivRef = useRef()

	const totalChance = rareTypes?.reduce((total, type) => Number.isInteger(type.chance) ? total + type.chance : total, 0)
	const buttonDisabled = totalChance !== 100;

	// set rareTypes
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

	// save rarity chances to local storage
	useEffect(() => {
		if (rareTypes) {
			rareTypes.forEach(type => {
				window.localStorage.setItem(type.rarityName, JSON.stringify(type))
			})
		}
		window.localStorage.setItem('setid', setid)
	})

	// check if page is long
	// useEffect(()=> {
	// 	window.addEventListener('resize', ()=> {
	// 		if(document.body.clientHeight > 1000)
	// 			setIsLongPage(true)
	// 		else
	// 		setIsLongPage(false)
	// 	})
	// })

	const handleProbabilityChange = (e) => {
		let newChanceVal = parseInt(e.target.value)
		
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
		// for benchmarking
		let t0 = performance.now()

		setTotalRolls(totalRolls + 1)
		
		let newPack = [
			...pickNonRareCards('common', cardsfromSet),
			...pickNonRareCards('uncommon', cardsfromSet),
			pickRareCard(cardsfromSet, rareTypes)
		]
		setPack(newPack)

		// for benchmarking
		const t1 = performance.now();
		console.log(`Call to handleGeneratePack took ${t1 - t0} milliseconds.`);
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
					totalRolls={ totalRolls }
					handleGeneratePack={ handleGeneratePack }
					totalChance={ totalChance }
				/>
				
				<section className={styles.section}>
					<h1 className={styles.sectionHeading}>How to use</h1>
					Some featured sets will have suggested probabilities for rares. There is 1 guaranteed rare per pack. Users can customize the 'rare' probability distribution using the panel on the left. Enjoy!
				</section>
			</header>

			<button
				className={ styles.genPackBtn }
				onClick={ handleGeneratePack } 
				disabled={ buttonDisabled }
			>
				open new pack
			</button>
{/* 
{ isLongPage && 
				<button className={styles.genPackBtn} onClick={() => bottomDivRef.current.scrollIntoView()}>jump to rare</button> } */}

			{ pack?.length > 0 && 
				<CardTray 
					pack={pack} 
					totalRolls={totalRolls} 
				/> }
			
			{/* { isLongPage && 
			<button className={styles.goToTop} onClick={() => window.scrollTo(0,0)}>go to top</button> } */}
 
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
	const cardsfromSet = data.data

	return {
		props: { cardsfromSet }
	}
}