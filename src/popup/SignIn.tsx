import React from 'react';
 import extLogo from '../assets/images/extLogo.png';
 import textLogo from '../assets/images/textLogo.png';
 import clearImage from '../assets/images/clearImage.png';
import { getAuthFromCookie } from '../utils/auth';


 interface SignInProps {
  navigateTo: (screenName: string) => void;
  loading: boolean;  // Add this line to include the loading prop

}

const SignIn: React.FC<SignInProps> = ({ navigateTo,loading }) => {
  const handleSignInClick = async () => {
    // const token =await getAuthFromCookie();
    // if (token) navigateTo("Autofill");
    // else
    window.open("https://app.rampedcareers.com/auth/login", "_blank")
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
          className="clearImage"
          onClick={handleClosePopUp}
        />
      </div>
      <p className="signinText">Sign In Required</p>
      <p className="signinInfo">To use Ramped Chrome Extension you need to be signed in</p>
      <div className="btnSeparator"></div>
      <div className="signinButtonContainer">
        <div className='uploadBtnContainer' >
          <button id="login-btn"
            className='signinBtn'
            onClick={handleSignInClick}
          >
            <div className='uploadBtn'>
            {loading ?
                <>
                  {/* <img src={refresh} alt="refresh"  /> */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                    <path d="M11.6668 6.91666C11.5242 5.89012 11.048 4.93896 10.3115 4.2097C9.57512 3.48044 8.61935 3.01353 7.59147 2.8809C6.56359 2.74827 5.52061 2.95727 4.6232 3.47572C3.72578 3.99416 3.02372 4.79329 2.62516 5.74999M2.3335 3.41666V5.74999H4.66683M2.3335 8.08332C2.47616 9.10986 2.95237 10.061 3.68879 10.7903C4.42521 11.5195 5.38097 11.9865 6.40885 12.1191C7.43674 12.2517 8.47972 12.0427 9.37713 11.5243C10.2745 11.0058 10.9766 10.2067 11.3752 9.24999M11.6668 11.5833V9.24999H9.3335" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <span >Sign In</span>

                </>
                : <span>Sign In</span>
              }
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
