import { useState } from 'react'
import styles from '../styles/RarityInputForm.module.css'

const RarityInputForm = ({ rareTypes, handleChange }) => {
  return (
    <form className={styles.form}>
      {rareTypes && rareTypes.map(r => {
        return (
          <div key={r.rarity} className={styles.inputSection}>
            <label htmlFor={r.rarity}>{r.rarity} </label>
            <input 
              className={styles.input}
              type='number'
              min='0'
              max='100'
              id={r.rarity} 
              onChange={handleChange} 
              value={rareTypes.find(el => el.rarity === r.rarity).chance}>
            </input>
          </div>
        )
      })}
    </form>
  )
}

export default RarityInputForm