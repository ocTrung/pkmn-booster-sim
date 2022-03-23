import styles from '../styles/CardTray.module.scss'
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
        />
      )}
    </div>
  )
}

export default CardTray