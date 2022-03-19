import styles from '../styles/Error.module.css'

const Error = ({ error }) => {
  return (
    <p className={styles.error}>
      {error.message}
    </p>
    
  )
}

export default Error