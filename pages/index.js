import Head from 'next/head'
import Header from '../components/Header'
import SetTray from '../components/SetTray'
import styles from '../styles/Home.module.scss'
import probabilityData from '../suggestedProbabilities.json'
import { getSets } from '../utils/pokemonAPI'

export default function Home({ sets }) {
  return (
    <>
      <Head>
        <title>Poke Booster Sim</title>
        <meta name='description' content='Pokemon booster pack simulator' key='ogMeta'/>
        <link rel='icon' href='/250 Ho-oh.ico' key='ogIcon'/>
      </Head>
      <main className={styles.main}>
        <Header></Header>
        { sets && <SetTray sets={ sets }/> }
      </main>
    </>
  )
}

export async function getStaticProps() {
  const setIds = Object.keys(probabilityData)

  let sets = await getSets(setIds)
    .then(res => res)
    .catch(err => {
      console.log(err)
      return null
    })
  
  if (!sets) {
    return {
      redirect: {
        destination: '/pageerror?error=homepage',
        permanent: false,
      }
    }
  }

  return {
    props: { sets }
  }
}
