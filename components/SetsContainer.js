import SetCard from './setCard'
import styles from '../styles/SetsContainer.module.css'

const Sets = ({ sets }) => {
  return (
    <div className={styles.container}>
      {sets?.map(s => (
        <SetCard key={s.id} set={s}></SetCard>
      ))}
    </div>
  )
}

export default Sets