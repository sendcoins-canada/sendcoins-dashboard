import Logoblack from "../../../assets/logoblack.svg"
import { CloseCircle } from "iconsax-react";
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

//  Header with Cancel button
export const HeaderWithCancel: React.FC<{ onCancel?: () => void }> = ({
  onCancel,
}) => {
  return (
    <div className="w-full py-8 md:px-16 px-4">
      <div className="flex md:px-8 justify-between items-center">
        <img src={Logoblack} alt="logo" />
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Cancel"
        >
          <CloseCircle className="w-6 h-6 text-gray-700" color="black"/>
        </button>
      </div>
    </div>
  );
};


export default Header