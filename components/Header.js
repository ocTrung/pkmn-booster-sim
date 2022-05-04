import styles from '../styles/Header.module.scss'

const Header = () => {
  return (
    <header className={styles.container}>
      <h1 className={styles.emphasis}>Pokemon </h1>
      <h1 className={styles.title}>Booster Pack Simulator</h1>
      <p className={styles.content}>
        A simulator to get a feel for &quot;<span className={styles.color}>pull rates</span>&quot; of a set. Choose from featured sets or use the search bar to find a set.
      </p>
    </header>
  )
}

export default Header