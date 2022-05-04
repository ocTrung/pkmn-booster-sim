export async function getSet(setId) {
  try {
    const res = await fetch(`https://api.pokemontcg.io/v2/sets/${setId}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.API_KEY
      }
    })

    return res

  } catch (err) {
    throw err
  }
}

export async function getSets(setIds) {
  try {
    let requestBatch = setIds.map(async (setId) => {
      const res = await getSet(setId)
      const data = await res.json()
      const set = data.data

      return set
    })

    const sets = await Promise.all(requestBatch)

    return sets

  } catch (err) {
    throw err
  }
}

export async function getCardsfromSet(setid) {
  try {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setid}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.API_KEY
      }
    })
    const data = await res.json()
    const cardsfromSet = data.data

    return cardsfromSet

  } catch (err) {
    throw err
  }
}

export async function searchSets(searchQuery) {
  try {
    const res = await fetch(`https://api.pokemontcg.io/v2/sets?q=name:"${searchQuery}"&orderBy=releaseDate&page=1&pageSize=10`, {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.API_KEY
      }
    })
    const data = await res.json()
    const sets = data.data

    return sets

  } catch (err) {
    throw err
  }
}