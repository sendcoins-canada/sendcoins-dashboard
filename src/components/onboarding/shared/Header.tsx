import React from 'react'
import backicon from "../../../assets/backicon.svg"
import Logo from "../../../assets/Logo.svg"
import Logoblack from "../../../assets/logoblack.svg"

const Header = () => {
  return (
    <div className='w-full py-8 px-16'>
        <div className='flex px-8 justify-between'>
            <img src={Logoblack} alt="logo" />
            <img src={backicon} alt="back-icon" />
        </div>
    </div>
  )
}

export default Header