import Head from 'next/head'
import Header from '../components/Header'
import SetTray from '../components/SetTray'
import styles from '../styles/Home.module.scss'
import probabilityData from '../suggestedProbabilities.json'

export default function Home({ sets }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Poke Booster Sim</title>
        <meta name='description' content='Pokemon booster pack simulator' key='ogMeta'/>
        <link rel='icon' href='/250 Ho-oh.ico' key='ogIcon'/>
      </Head>

      <main className={styles.main}>
        <Header></Header>
        { sets && <SetTray sets={ sets }/> }
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const setIds = Object.keys(probabilityData)

  let requests = setIds.map((setId) => {
    const set = fetch(`https://api.pokemontcg.io/v2/sets?q=id:${setId}`)
      .then(res => res.json())
      .then(data => data.data[0])
    return set
  })
  
  const sets = await Promise.all(requests)

	return {
		props: { sets }
	}
}
