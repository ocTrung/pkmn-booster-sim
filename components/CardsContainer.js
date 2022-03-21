import styles from '../styles/CardsContainer.module.css'
import Card from './Card'

const BoosterPack = ({ pack, totalRolls, showCards, setShowCards }) => {
  return (
    <div id='cardContainer' className={styles.container}>
      {pack?.map((card, i) => 
        <Card 
          key= {card.id + totalRolls} 
          card={card} 
          totalRolls={totalRolls}
          index={i}
          showCards={ showCards } 
					setShowCards={ setShowCards }
        >
        </Card>)}
    </div>
  )
}

export default BoosterPack