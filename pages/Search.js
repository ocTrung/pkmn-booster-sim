import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SetsContainer from '../components/SetsContainer'

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
    <SetsContainer sets={searchResults}/>
  )
}

export async function getSearchResults(searchQuery) {
  console.log('fetch', searchQuery)
  const res = await fetch(`https://api.pokemontcg.io/v2/sets?q=name:"${searchQuery}"&orderBy=releaseDate&page=1&pageSize=10`)
	const data = await res.json()
  const sets = data.data

	return sets
}

export default Search