import React from 'react'
import backicon from "../../../assets/backicon.svg"
import Logo from "../../../assets/Logo.svg"
import Logoblack from "../../../assets/logoblack.svg"
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()
  return (
    <div className='w-full py-8 px-16'>
        <div className='flex px-8 justify-between'>
            <img src={Logoblack} alt="logo" />
            <img src={backicon} alt="back-icon" onClick={() => navigate(-1)}/>
        </div>
    </div>
  )
}

export default Header