import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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
    <SetTray sets={searchResults}/>
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