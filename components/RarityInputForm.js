import styles from '../styles/RarityInputForm.module.scss'
import { useState } from 'react'

const RarityInputForm = ({ rareTypes, handleChange, totalOpened, totalOdds }) => {
  const [showDetails, setShowDetails] = useState(true)
  let error = null

  if (totalOdds > 100)
    error = { message: 'Total must not exceed 100' }

  const pointsLeft = parseFloat((100 - totalOdds).toFixed(2))
  const pointsStyle = pointsLeft === 0 ? styles.success : styles.failure

  return (
    <div className={styles.formContainer}>
      <button
        className={styles.showDetailBtn}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'hide details' : 'show details'}
      </button>

      {showDetails &&
        <form className={styles.form}>
          {rareTypes && rareTypes.map(r => {
            return (
              <div key={r.rarityName} className={styles.inputSection}>
                <label className={styles.label} htmlFor={r.rarityName}>{r.rarityName} </label>
                <input
                  id={r.rarityName}
                  className={styles.input}
                  type='number'
                  min='0'
                  max='100'
                  step='any'
                  onChange={handleChange}
                  value={rareTypes.find(el => el.rarityName === r.rarityName).odds}>
                </input>
              </div>
            )
          })}
        </form>}
      <section className={styles.feedback}>
        <p className={styles.feedback}>
          points left: <span className={pointsStyle}> {isNaN(pointsLeft) ? 'All inputs must be a number' : pointsLeft} </span>
        </p>
        <p className={styles.feedbackText}>packs opened: {totalOpened}</p>
      </section>
      {error !== null &&
        <div className={styles.error}>
          {error.message}
        </div>
      }
    </div>
  )
}

export default RarityInputForm