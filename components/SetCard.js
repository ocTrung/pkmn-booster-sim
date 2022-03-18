import styles from '../styles/SetCard.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'

const SetCard = ({ set }) => {
  return (
    
    <Link href={`/set/${set.id}`}>
      <a className={styles.a}>
        <div className={styles.cardContainer}>
          <img className={styles.img} src={set.images.logo}></img>
          <p className={styles.name}>{set.name}</p>
        </div>
      </a>
    </Link>
  )
}

export default SetCard