import styles from '../styles/Navbar.module.css'

const Navbar = () => {
  return (
    <div  className={styles.container}>
      {/* <picture className={styles.icon}>
        <source srcset="/venusaur.png" media="(min-width: 75em)"></source>
        <source srcset="/ivysaur.png" media="(min-width: 40em)"></source>
        <img src="/bulbasaur.png" 
        alt="A description of the image." 
        >
        </img>
      </picture> */}
      {/* <h1 className={styles.title}>Pokemon Booster Pack Sim</h1> */}
      <picture className={styles.icon}>
        <source srcset="/charizard.png" media="(min-width: 75em)"></source>
        <source srcset="/charmeleon.png" media="(min-width: 40em)"></source>
        <img src="/charmander.png" 
          alt="A description of the image." 
          >
        </img>
      </picture>
      <input className={styles.search} type='text'></input>
      <div className={styles.right}></div>
      {/* <picture className={styles.icon}>
        <source srcset="/blastoise.png" media="(min-width: 75em)"></source>
        <source srcset="/wartortle.png" media="(min-width: 40em)"></source>
        <img src="/squirtle.png" 
          alt="A description of the image." 
          >
        </img>
      </picture> */}
    </div>
  )
}

export default Navbar