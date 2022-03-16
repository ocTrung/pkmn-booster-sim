import styles from '../styles/BoosterPack.module.css'
import Card from './Card'

const BoosterPack = ({ pack }) => {
  return (
    <div className={styles.container}>
      {pack.map(card => <Card card={card}></Card>)}
    </div>
  )
}

export default BoosterPack