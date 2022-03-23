import Link from 'next/link'
import { useRouter } from 'next/router'

const pageError = () => {
  const router = useRouter()
  const error = router.query.error
  let message = null

  switch (error) {
    case 'homepage':
      message = 'Oh no, there was an error visiting the home page!'
  }

  console.log(error)
  return (
    <>
      <div>{message}</div>
      <Link href='/'>
        <a>Return home</a>
      </Link>
    </>
  )
}

export default pageError