import styles from '../styles/Card.module.css'
import { useState, useEffect, useMemo } from 'react'

const Card = ({ card }) => {
  const [showCard, setShowCard] = useState(false)

  let cardStyle = styles.img
  let containerStyle = styles.container

  if (showCard) {
    cardStyle = styles.img + ' ' + styles.showCard
    containerStyle = styles.container + ' ' + styles.hideBg
  } else {
    cardStyle = styles.img
    containerStyle = styles.container
  }

  return (
    <div id='card' className={containerStyle}>
      <img 
        key={card.id} 
        src={card.images.large} 
        alt={card.id} 
        className={cardStyle} 
        onClick={()=> {
          setShowCard(!showCard)
          console.log('clicked')
        }}/>
    </div>
  )
}

export default Card