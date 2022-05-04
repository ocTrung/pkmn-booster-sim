import Link from 'next/link'
import { useRouter } from 'next/router'

const PageError = () => {
  const router = useRouter()
  const error = router.query.error
  let message = null

  switch (error) {
    case 'homepage':
      message = 'Oh no, there was an error visiting the home page!'
      break
    case 'boosterpackpage':
      message = 'There was a problem loading the page for this set. Try refreshing or another set.'
      break
    case 'searchpage':
      message = 'There was a problem retrieving search results. Try refreshing or changing the query.'
      break
    default:
      message = 'Page not found!'
  }

  return (
    <>
      <div>{message}</div>
      <Link href='/'>
        <a>Return home</a>
      </Link>
    </>
  )
}

export default PageError