import React, { useEffect } from 'react';
import extLogo from '../../../assets/images/extLogo.png';
import textLogo from '../../../assets/images/textLogo.png';
import clear from '../../../assets/images/clear.png';

import './Header.css';

const Header: React.FC = () => {

const closeFrame = () => {

  chrome.runtime.sendMessage({ action: "closeIFrame" }, function (response) {
    console.log(response); // Process the response from the background script
  });
  
  
}
const moveFrame = () => {

  chrome.runtime.sendMessage({ action: "moveFrame" }, function (response) {
  });
  
}

  return (
    <div className="header-container">
      <div className="header-content">
        <div className="header-inner">
          <div className="logo-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-arrow-left-right left-right-arrow icon" viewBox="0 0 16 16" 
            onClick={moveFrame}
            >
              <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5" />
            </svg>
            <img src={extLogo} alt="logo" className="header-logo" />
            <img src={textLogo} alt="logo" className="header-logo" />
            <p className="premium-text">Premium</p>
          </div>
          <img src={clear} alt="clear" className="close-button" id="close-iframe-button-ramped" onClick={closeFrame}/>
        </div>
      </div>
    </div>
  );
};

export default Header;
