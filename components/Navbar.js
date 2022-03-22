import styles from '../styles/Navbar.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Navbar = () => {
  const router = useRouter()

  const handleSubmitSearch = (e) => {
    e.preventDefault()
    const query = e.target.elements.search.value
    console.log(query)
    router.push(`/Search?q=${query}`)
  }
  return (
    <div  className={styles.container}>
      <Link href='/'>
        <a>
          <picture className={styles.icon}>
            <source srcSet="/venusaur.png" media="(min-width: 75em)"></source>
            <source srcSet="/ivysaur.png" media="(min-width: 40em)"></source>
            <img 
              src="/bulbasaur.png" 
              alt="A description of the image." 
              className={styles.img}
            >
            </img>
          </picture>
        </a>
      </Link>

      <form onSubmit={handleSubmitSearch}>
        <input id='search' className={styles.search} type='text' placeholder=' Search Sets'></input>
      </form>
    </div>
  )
}

export default Navbar