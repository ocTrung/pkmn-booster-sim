import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import SetTray from '../components/SetTray'
import { searchSets } from '../utils/pokemonAPI'

const Search = () => {
  const router = useRouter()
  const searchQuery = router.query.q
  const [searchResults, setSearchResults] = useState(null)

  useEffect(() => {
    getSearchResults(searchQuery)
      .then((payload) => {
        setSearchResults(payload)
      })
  }, [searchQuery])

  return (
    <>
      <Head>
        <title>Search Sets</title>
				<meta name="description" content="Pokemon booster pack simulator" key='ogMeta'/>
				<link rel="icon" href="/Ho-oh.png" key='ogIcon'/>
      </Head>
      { 
        searchResults?.length !== 0 
        ? <SetTray sets={searchResults}/>
        : 'No results' 
      }
    </>
  )
}

export async function getSearchResults(searchQuery) {
  const sets = await searchSets(searchQuery)
    .then(res => res)
    .catch(err => {
      console.log('err',err)
      return null
    })
  
  if (!sets) {
    return {
      redirect: {
        destination: '/pageerror?error=searchpage',
        permanent: false,
      }
    }
  }
  
	return sets
}

export default Search