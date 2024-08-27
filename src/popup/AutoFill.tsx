import React, { useEffect } from "react";
import extLogo from "../assets/images/extLogo.png";
import textLogo from "../assets/images/textLogo.png";
import clearImage from "../assets/images/clearImage.png";

interface AutoFillProps {
  navigateTo: (screenName: string) => void;
}
const Autofill: React.FC <AutoFillProps> = ({ navigateTo }) => {
  const [loader, setLoader] = React.useState(false);
  const handleAutoFillClick = () => {
    setLoader(true);
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
     tabs.forEach((tab) => {
       if (tab && tab.id)
         chrome.tabs.sendMessage(
           tab.id,
           { action: "openIframe" },
           (response) => {
             window.close();
           }
         );
         
     });
     
   });
   
   
   setLoader(false);

  };
  const handleClosePopUp = () => {
    window.close()
  };


  return (
    <div id="signin-wrapper">
      <div className="premiumHeader">
        <div className="leftSide">
          <img src={extLogo} alt="logo" />
          <img src={textLogo} alt="logo" />
          <p className="premiumText">Premium</p>
        </div>
        <img
          src={clearImage}
          alt="clear"
          onClick={handleClosePopUp}
          className="clearImage"
        />
      </div>
      {/*  */}
      <div className="autoApplyWrapper">
        <h1 className="mainHeading">Autofill Application</h1>
        <p className="autofillText">
        Do you want to autofill this job application with data from your Ramped profile?
        </p>
        <p className="autofillText">
        <span>or </span> <span className='view-profile'> view your profile</span> 
        </p>
        <div className="separator"></div>
        <div className="loginContainer">
          {/* <form className="loginForm"> */}
            <button className="autoApplyBtn" onClick={handleAutoFillClick}>
            {loader ?
                <>
                  {/* <img src={refresh} alt="refresh"  /> */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                    <path d="M11.6668 6.91666C11.5242 5.89012 11.048 4.93896 10.3115 4.2097C9.57512 3.48044 8.61935 3.01353 7.59147 2.8809C6.56359 2.74827 5.52061 2.95727 4.6232 3.47572C3.72578 3.99416 3.02372 4.79329 2.62516 5.74999M2.3335 3.41666V5.74999H4.66683M2.3335 8.08332C2.47616 9.10986 2.95237 10.061 3.68879 10.7903C4.42521 11.5195 5.38097 11.9865 6.40885 12.1191C7.43674 12.2517 8.47972 12.0427 9.37713 11.5243C10.2745 11.0058 10.9766 10.2067 11.3752 9.24999M11.6668 11.5833V9.24999H9.3335" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <span >Autofill</span>

                </>
                : <span>Autofill</span>
              }
            </button>
          {/* </form> */}
        </div>
      </div>
    </div>
  );
};

export default Autofill;
