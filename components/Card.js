import styles from '../styles/Card.module.css'
import { useState } from 'react'

const Card = ({ card, index, showCards, setShowCards }) => {
  let cardStyle = styles.img
  let containerStyle = styles.container

  if (showCards && showCards[index]) {
    cardStyle = styles.img + ' ' + styles.showCard
    containerStyle = styles.container + ' ' + styles.hideBg
  } 

  const handleShowCard = () => {
    const newShowCardVals = showCards.map((showCard, i) => index === i ? true : showCard)
    setShowCards(newShowCardVals)
  }
  
  let delay = `calc(${index} * 200ms)`

  if (showCards.some(showCard => showCard === false))
    delay = '0ms'

  return (
    <div id='card' className={containerStyle} onClick={ handleShowCard }>
      <img 
        key={card.id} 
        src={card.images.large} 
        alt={card.id} 
        className={cardStyle} 
        style={{transitionDelay: delay}}
        />
    </div>
  )
}

export default Card