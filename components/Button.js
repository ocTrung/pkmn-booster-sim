const Button = ({onClick, style, disabled, children }) => {
  return (
    <button
      className={ style }
      onClick={ onClick } 
      disabled={ disabled }
    >
      { children }
    </button>
  )
}

export default Button