import styles from '../styles/SetCard.module.scss'
import Link from 'next/link'

const SetCard = ({ set }) => {
  // const setName = set.name.toLowerCase()
  return (
    <Link href={`/set/${set.id}?setname=${set.name}`}>
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