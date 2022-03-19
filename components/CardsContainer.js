import styles from '../styles/CardsContainer.module.css'
import Card from './Card'

const BoosterPack = ({ pack, totalRolls }) => {
  console.log(pack.length)
  return (
    <div id='cardContainer' className={styles.container}>
      {/* <Card card={pack[0]}></Card> */}
      {pack.map(card => <Card key= {card.id + totalRolls} card={card} totalRolls={totalRolls}></Card>)}
    </div>
  )
}

export default BoosterPack