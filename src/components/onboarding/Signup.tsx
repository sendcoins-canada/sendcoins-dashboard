import React from 'react'
import Header from './shared/Header'
import { Button } from '../ui/button'

const Signup = () => {
  return (
    <div>
        <Header />
        <div className='flex'>
            <h2>Welcome to Sendcoins</h2>
            <p>Move your money globally — fast, secure, and stress-free. <span className='font-semibold'> Sign in to get started.</span></p>
            <Button className='bg-brand'>HIIII</Button>
        </div>

    </div>
  )
}

export default Signup