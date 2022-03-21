import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import CardContainer from '../../components/CardsContainer'
import RarityInputForm from '../../components/RarityInputForm'
import { getRarityList, pickNonRareCards, pickRareCard } from '../../utils/packOpener'
import styles from '../../styles/Set.module.scss'
import Button from '../../components/Button'

export default function Sets({ cards: cardsfromSet }) {
	const [rareTypes, setRareTypes] = useState(null)
	const [pack, setPack] = useState(null)
	const [totalRolls, setTotalRolls] = useState(0)
	const [isLongPage, setIsLongPage] = useState(false)

	const router = useRouter()
	const { setid, setname } = router.query
	const bottomDivRef = useRef()

	const totalChance = rareTypes?.reduce((total, type) => Number.isInteger(type.chance) ? total + type.chance : total, 0)
	const buttonDisabled = totalChance !== 100;
	
	const handleProbabilityChange = (e) => {
		let newChanceVal = parseInt(e.target.value)
		
		const inputRarity = e.target.id

		const newRareTypes = rareTypes.map(r => {
			if (r.rarity === inputRarity) 
				return {rarity: inputRarity, chance: newChanceVal}
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
				t.chance = rareTypefromStorage.chance
			})
		}
		else {
			window.localStorage.clear()
		}
		setRareTypes(newRareTypes)
	}, [cardsfromSet])

	// save rarity chances to local storage
	useEffect(() => {
		if (rareTypes) {
			rareTypes.forEach(type => {
				window.localStorage.setItem(type.rarity, JSON.stringify(type))
			})
		}
		window.localStorage.setItem('setid', setid)
	})

	useEffect(()=> {
		window.addEventListener('resize', ()=> {
			if(document.body.clientHeight > 1000)
				setIsLongPage(true)
			else
			setIsLongPage(false)
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

			<RarityInputForm 
				rareTypes={ rareTypes } 
				handleChange={ handleProbabilityChange }
				totalRolls={ totalRolls }
				handleGeneratePack={ handleGeneratePack }
				totalChance={ totalChance }
			/>

			<Button
        style={ styles.genPackBtn }
        onClick={ handleGeneratePack } 
        disabled={ buttonDisabled }
      > 
        open new pack
      </Button>
			{ isLongPage && 
				<button className={styles.genPackBtn} onClick={() => bottomDivRef.current.scrollIntoView()}>jump to rare</button> }

			{ pack?.length > 0 && 
				<CardContainer pack={pack} totalRolls={totalRolls}></CardContainer> }
			
			{ isLongPage && 
			<button className={styles.goToTop} onClick={() => window.scrollTo(0,0)}>go to top</button> }
 
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