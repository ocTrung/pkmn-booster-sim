import styles from '../styles/Header.module.css'
const Header = () => {
  return (
    <div className={styles.container}>
      <h1>Pokemon Booster Pack Sim</h1>
      <p>
        A simulator created to get a feel for pull rates for a set.
        Choose from featured sets or use the search to find a set.

      </p>
    </div>
  )
}

export default Header