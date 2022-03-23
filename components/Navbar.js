import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'
import styles from '../styles/Navbar.module.scss'

const Navbar = () => {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmitSearch = (e) => {
    e.preventDefault()
    router.push(`/Search?q=${query}`)
    setQuery('')
  }

  const handleChange = (e) => setQuery(e.target.value)

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
        <input 
          id='search' 
          className={styles.search} 
          type='text' 
          placeholder=' Search Sets' 
          value={query} 
          onChange={handleChange}></input>
      </form>
    </div>
  )
}

export default Navbar