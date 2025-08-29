import { SignIn } from '@clerk/nextjs'
import { div } from 'motion/react-client'

export default function Page() {
  return <div className='flex item-center h-screen justify-center'> <SignIn /> </div>
}