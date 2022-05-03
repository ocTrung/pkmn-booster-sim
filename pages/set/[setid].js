import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'

import CardTray from '../../components/CardTray'
import RarityInputForm from '../../components/RarityInputForm'
import styles from '../../styles/Set.module.scss'
import probabilityData from '../../suggestedProbabilities.json'
import { getRarityList, pickNonRareCards, pickRareCard, round100 } from '../../utils/packOpener'
import { getCardsfromSet } from '../../utils/pokemonAPI'


export default function Sets({ cardsfromSet }) {
	const [rareTypes, setRareTypes] = useState(null)
	const [pack, setPack] = useState(null)
	const [totalOpened, setTotalOpened] = useState(0)
	const router = useRouter()
	const { setid, setname } = router.query

	const totalOdds = rareTypes?.reduce((acc, type) => typeof type.odds === 'number' ? acc + type.odds : total, 0)
	const buttonDisabled = Math.ceil(totalOdds) !== 100;

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
					newRareTypes.forEach(t => {
						const rarityName = t.rarityName
						const odds = probabilityData[setid][rarityName]
						t.odds = odds
					})
				}
			} else {
				if (Object.hasOwn(probabilityData, setid)) {
					newRareTypes.forEach(t => {
						const rarityName = t.rarityName
						const odds = probabilityData[setid][rarityName]
						t.odds = odds
					})
				}
			}
		}
		setRareTypes(newRareTypes)
	}, [cardsfromSet])

	// Save rarity probabilities to local storage
	useEffect(() => {
		if (rareTypes) {
			rareTypes.forEach(type => {
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
				return {rarityName: inputRarity, odds: newOdds}
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
				<link rel="icon" href="/Ho-oh.png" key='ogIcon'/>
			</Head>
			<header className={styles.header}>
				<RarityInputForm 
					rareTypes={ rareTypes } 
					handleChange={ handleProbabilityChange }
					totalOpened={ totalOpened }
					handleGeneratePack={ handleGeneratePack }
					totalOdds={ totalOdds }
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
	const cardsfromSet = await getCardsfromSet(params.setid)
    .then(res => res)
    .catch(err => {
      console.log('err', err)
      return null
    })
  
  if (!cardsfromSet) {
    return {
      redirect: {
        destination: '/pageerror?error=boosterpackpage',
        permanent: false,
      }
    }
  }

  return {
		props: { cardsfromSet }
	}
}