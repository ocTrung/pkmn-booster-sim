import styles from '../styles/Card.module.scss'

const Card = ({ card, index }) => {
  let cardStyle = styles.img
  let containerStyle = styles.container
  let baseDelay = '250ms'
  let delay = `calc(${index} * 200ms + ${baseDelay})`

  return (
    <div id='card' className={containerStyle} style={{ animationDelay: delay }}>
      <img
        key={card.id}
        src={card.images.large}
        alt={card.id}
        className={cardStyle}
        style={{ animationDelay: delay }}
        width='380px'
        height='519.5px'
      />
    </div>
  )
}

export default Card