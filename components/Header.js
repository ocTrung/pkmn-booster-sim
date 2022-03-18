import styles from '../styles/Header.module.css'
const Header = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pokemon Booster Pack Simulator</h1>
      <p className={styles.content}>
        A simulator created to get a feel for pull rates of a set. Choose from featured sets or use the search to find a set.
      </p>
    </div>
  )
}

export default Header