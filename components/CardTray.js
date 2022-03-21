import styles from '../styles/CardTray.module.css'
import Card from './Card'

const CardTray = ({ pack, totalRolls }) => {
  return (
    <div id='cardContainer' className={styles.container}>
      {pack?.map((card, i) => 
        <Card 
          key= {card.id + totalRolls} 
          card={card} 
          totalRolls={totalRolls}
          index={i}
        >
        </Card>)}
    </div>
  )
}

export default CardTray