import styles from '../styles/Navbar.module.scss'

const Navbar = () => {
  console.log('navbar rendered')
  return (
    <div  className={styles.container}>
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
      {/* <h1 className={styles.title}>Pokemon Booster Pack Sim</h1> */}
      {/* <picture className={styles.icon}>
        <source srcset="/charizard.png" media="(min-width: 75em)"></source>
        <source srcset="/charmeleon.png" media="(min-width: 40em)"></source>
        <img src="/charmander.png" 
          alt="A description of the image." 
          >
        </img>
      </picture>
      <div className={styles.right}></div> */}
      {/* <picture className={styles.icon}>
        <source srcSet="/blastoise.png" media="(min-width: 75em)"></source>
        <source srcSet="/wartortle.png" media="(min-width: 40em)"></source>
        <img 
          src="/squirtle.png" 
          alt="A description of the image." 
          className={styles.img}
        >
        </img>
      </picture> */}

      <input className={styles.search} type='text' placeholder=' Search Sets'></input>
    </div>
  )
}

export default Navbar