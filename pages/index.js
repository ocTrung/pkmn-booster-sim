import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'

export default function Home({ sets }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Poke Booster Sim</title>
        <meta name="description" content="Pokemon booster pack simulator" />
        <link rel="icon" href="/250 Ho-oh.ico" />
      </Head>
      <Navbar></Navbar>
      <Header></Header>

      <main className={styles.main}>
        <ul>
          {sets?.map(s => (
            <li key={s.id}>  
              <Link href={`/set/${s.id}`}>
                <a>{s.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch('https://api.pokemontcg.io/v2/sets?orderBy=releaseDate&page=1&pageSize=10')
  const data = await res.json()
  const sets = data.data

  return {
    props: {
      sets
    }
  }
}
