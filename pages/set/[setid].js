import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'

import CardTray from '../../components/CardTray'
import RarityInputForm from '../../components/RarityInputForm'
import styles from '../../styles/Set.module.scss'
import probabilityData from '../../suggestedProbabilities.json'
import { getRarityList, pickNonRareCards, pickRareCard, round100 } from '../../utils/packOpener'
import { getCardsfromSet } from '../../utils/pokemonAPI'


export default function Sets({ cardsFromSet }) {
	const [rareTypes, setRareTypes] = useState(null)
	const [pack, setPack] = useState(null)
	const [totalOpened, setTotalOpened] = useState(0)
	const router = useRouter()
	const { setid, setname } = router.query

	const totalOdds = rareTypes?.reduce((acc, type) => typeof type.odds === 'number' ? acc + type.odds : acc, 0)
	const isTotalOdds100 = totalOdds !== 100;

	// Initialize rare types
	useEffect(() => {
		let newRareTypes = null

		if (cardsFromSet?.length > 0) {
			newRareTypes = getRarityList(cardsFromSet)
		}
		if (setid === window.localStorage.setid) {
			newRareTypes?.forEach(t => {
				const rarityName = t.rarityName
				const rareTypefromStorage = JSON.parse(window.localStorage.getItem(rarityName))
				t.odds = rareTypefromStorage.odds
			})
		}
		else {
			window.localStorage.clear()

			// If currently viewed set is not the same set we viewed previously, 
			// check if the set is included in file with suggested probability distribution data
			// For browsers that do not yet support Object.hasOwn()
			if (typeof Object.hasOwn !== 'function') {
				if (probabilityData.hasOwnProperty(setid)) {
					newRareTypes?.forEach(t => {
						const rarityName = t.rarityName
						const odds = probabilityData[setid][rarityName]
						t.odds = odds
					})
				}
			} else {
				if (Object.hasOwn(probabilityData, setid)) {
					newRareTypes?.forEach(t => {
						const rarityName = t.rarityName
						const odds = probabilityData[setid][rarityName]
						t.odds = odds
					})
				}
			}
		}
		setRareTypes(newRareTypes)
	}, [cardsFromSet])

	// Save rarity probabilities to local storage
	useEffect(() => {
		if (rareTypes) {
			rareTypes?.forEach(type => {
				window.localStorage.setItem(type.rarityName, JSON.stringify(type))
			})
		}
		window.localStorage.setItem('setid', setid)
	})

	const handleProbabilityChange = (e) => {
		let newOdds = round100(parseFloat(e.target.value))
		const inputRarity = e.target.id

		const newRareTypes = rareTypes.map(r => {
			if (r.rarityName === inputRarity)
				return { rarityName: inputRarity, odds: newOdds }
			else
				return r
		})

		setRareTypes(newRareTypes)
	}

	const handleGeneratePack = () => {
		setTotalOpened(totalOpened + 1)

		let newPack = []

		if (rareTypes.find(type => type.rarityName === 'Promo') && rareTypes?.length === 1) {
			newPack = [
				pickRareCard(cardsFromSet, rareTypes)
			]
		} else {
			newPack = [
				...pickNonRareCards('common', cardsFromSet),
				...pickNonRareCards('uncommon', cardsFromSet),
				pickRareCard(cardsFromSet, rareTypes)
			]
		}

		setPack(newPack)
	}

	if (router.isFallback) {
		return (
			<h1>Building page...</h1>
		)
	}

	if (cardsFromSet.length === 0) {
		return (
			<h1>You may be trying to access a new set. Please wait 10 seconds before refreshing to allow the new page to build.</h1>
		)
	}

	return (
		<>
			<Head>
				<title>{setname}</title>
				<meta name='description' content='A simulator to get a feel for pull rates of a set. Choose from featured sets or use the search bar to find a set.' key='ogMeta' />
				<link rel="icon" href="/Ho-oh.ico" key='ogIcon' />
			</Head>
			<header className={styles.header}>
				<RarityInputForm
					rareTypes={rareTypes}
					handleChange={handleProbabilityChange}
					totalOpened={totalOpened}
					handleGeneratePack={handleGeneratePack}
					totalOdds={totalOdds}
				/>
				<details className={styles.details} open>
					<summary className={styles.summary}>How to use</summary>
					There is 1 guaranteed rare per pack. Users can customize the probability
					distribution for rarities using the input panel.
					Input accepts up to 2 decimal places (ex: 1.25). Enjoy!
				</details>
			</header>
			<button
				className={styles.genPackBtn}
				onClick={handleGeneratePack}
				disabled={isTotalOdds100}
			>
				open new pack
			</button>
			{pack?.length > 0 &&
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
		fallback: 'blocking'
	};
}

export async function getStaticProps({ params }) {
	const cardsFromSet = await getCardsfromSet(params.setid)

	return {
		props: { cardsFromSet },
		revalidate: 10
	}
}