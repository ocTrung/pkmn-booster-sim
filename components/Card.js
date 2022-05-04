import styles from '../styles/Card.module.scss'
import Image from 'next/image'

const Card = ({ card, index }) => {
  let containerStyle = styles.container
  let baseDelay = '250ms'
  let delay = `calc(${index} * 200ms + ${baseDelay})`

  return (
    <div id='card' className={containerStyle} style={{ animationDelay: delay }}>
      <div
        className={styles.cardWrapper}
        style={{ animationDelay: delay }}
      >
        <Image
          key={card.id}
          className={styles.nextImg}
          src={card.images.large}
          alt={card.id}
          width='380px'
          height='519.5px'
        />
      </div>
    </div>
  )
}

export default Card