import styles from '../styles/CardsContainer.module.css'
import Card from './Card'

const BoosterPack = ({ pack, totalRolls }) => {
  return (
    <div id='cardContainer' className={styles.container}>
      {pack?.map(card => <Card key= {card.id + totalRolls} card={card} totalRolls={totalRolls}></Card>)}
    </div>
  )
}

export default BoosterPack