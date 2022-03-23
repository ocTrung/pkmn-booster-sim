export async function getSet(setId) {
  const res = await fetch(`https://api.pokemontcg.io/v2/sets/${setId}`, {
    method: 'GET',
    headers: {
      'X-API-KEY': process.env.API_KEY
    }
  })

  return res
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
