import styles from '../styles/RarityInputForm.module.scss'
import { useState } from 'react'

const RarityInputForm = ({ rareTypes, handleChange, totalRolls, totalChance }) => {
  const [showDetails, setShowDetails] = useState(true)
  let error = null
	  
	if (totalChance > 100) 
    error = { message: 'Total must not exceed 100'}

  const pointsLeft = 100 - totalChance
  const pointsStyle = pointsLeft === 0 ? styles.success : styles.failure
  
  return (
    <div className={styles.formContainer}>
      <button 
        onClick={() => setShowDetails(!showDetails)} 
        className={ styles.showDetailBtn }
      >
        { showDetails ? 'hide details' : 'show details' }
      </button>

      { showDetails && 
      <form className={styles.form}>
        {rareTypes && rareTypes.map((r, index) => {
          return (
            <div key={r.rarityName} className={styles.inputSection}>
              <label className={styles.label} htmlFor={r.rarityName}>{r.rarityName} </label>
              <input 
                id={r.rarityName} 
                className={styles.input}
                type='number'
                min='0'
                max='100'
                onChange={handleChange} 
                value={rareTypes.find(el => el.rarityName === r.rarityName).chance}>
              </input>
            </div>
          )
        })}
      </form> }
      <section className={ styles.feedback }>
        <p className={ styles.feedback }>points left: <span className={pointsStyle}> { isNaN(pointsLeft) ? '' : pointsLeft } </span></p>
        <p className={ styles.feedbackText }>packs opened: {totalRolls}</p>
      </section>
      { error !== null && 
        <div className={styles.error}>
          {error.message}
        </div>
      }
    </div>
  )
}

export default RarityInputForm