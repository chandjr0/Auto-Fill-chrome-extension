import React from 'react';
 import extLogo from '../assets/images/extLogo.png';
 import textLogo from '../assets/images/textLogo.png';
 import clearImage from '../assets/images/clearImage.png';
import { SUBSCRIBE_URL } from '../popup/constant/popupLinks';
interface SubscribeProps {
  navigateTo: (screenName: string) => void;
}

const Subscribe: React.FC <SubscribeProps>= ({navigateTo}) => {
  const handleSubscribeClick = () => { 
    window.open(SUBSCRIBE_URL, "_blank");

    
  };
  const handleClosePopUp =()=>{
    window.close()
}

  return (
    <div id="signin-wrapper">
      <div className="premiumHeader">
        <div className="leftSide">
          <img src={extLogo} alt="logo" />
          <img src={textLogo} alt="logo" />
          <p className="premiumText">Premium</p>
        </div>
        <img src={clearImage} alt="clear" onClick={handleClosePopUp} className="clearImage" />
      </div>
      <p className="signinText">You need to Subscribe</p>
      <p className="signinInfo">This feature requires a Ramped Premium subscription.</p>
      <div className="btnSeparator"></div>
      <div className="signinButtonContainer">
        <div className='uploadBtnContainer' >
          <button id="login-btn"
            className='subscribeBtn'
            onClick={handleSubscribeClick}
          >
            <div className='uploadBtn'>
              <span>Subscribe</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
