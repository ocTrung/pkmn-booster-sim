import styles from '../styles/Card.module.css'

const Card = ({ card }) => {
  return (
    <div className={styles.container}>
      <img key={card.id} src={card.images.small} alt={card.id} className={styles.img}/>
    </div>
  )
}

export default Card