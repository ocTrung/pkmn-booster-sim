import React from 'react'

const RarityInputForm = ({ rareTypes, handleChange }) => {
  let totalFavorableOutcomes = rareTypes ? rareTypes.reduce((pv, cv) => cv.favorableOutcomes + pv, 0) : 0

  return (
    <>
      <form>
        {rareTypes && rareTypes.map(r => {
          return (
            <div key={r.rarity}>
              <label htmlFor={r.rarity}>{r.rarity} </label>
              <input 
                type='text' 
                id={r.rarity} 
                onChange={handleChange} 
                value={rareTypes.find(el => el.rarity === r.rarity).favorableOutcomes}>
              </input>
            </div>
          )
        })}
      </form>
      <p>points left: { 100 - totalFavorableOutcomes }</p>
    </>

  )
}

export default RarityInputForm