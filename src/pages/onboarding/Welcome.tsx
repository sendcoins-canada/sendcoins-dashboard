import React from 'react'
import hi from "../../assets/hi.png"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
    const navigate = useNavigate()

  return (
    <div className='bg-black text-white min-h-screen flex justify-center'>
        <div className='flex flex-col  items-center md:max-w-[30%] mx-auto text-center mt-36 space-y-6'>

        <img src={hi} alt="wave"  />
        <h1 className='font-extrabold text-[56px] leading-[64px] '>Hey there!  Welcome</h1>
        <p className='text-textgray'>You're one step closer to sending coins your <br /> way, fast, easy, and stress-free</p>
        <Button variant={'white'} className='cursor-pointer' onClick={()=> navigate('/survey')}>Continue</Button>
        </div>
    </div>
  )
}

export default Welcome