import Logoblack from "../../../assets/logoblack.svg"
// import { useNavigate } from 'react-router-dom'

const Header = () => {
    // const navigate = useNavigate()
  return (
    <div className='w-full py-8 md:px-16 px-4'>
        <div className='flex md:px-8 justify-center'>
            <img src={Logoblack} alt="logo" />
            {/* <img src={backicon} alt="back-icon" onClick={() => navigate(-1)}/> */}
        </div>
    </div>
  )
}

export default Header