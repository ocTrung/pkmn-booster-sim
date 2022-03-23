import SetCard from './setCard'
import styles from '../styles/SetTray.module.scss'

const SetTray = ({ sets }) => {
  return (
    <div className={styles.container}>
      {sets?.map(s => (
        <SetCard key={s.id} set={s}></SetCard>
      ))}
    </div>
  )
}

export default SetTray