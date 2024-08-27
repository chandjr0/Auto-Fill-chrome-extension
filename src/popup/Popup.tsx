
import React, { useEffect, useState } from 'react';
import './Popup.css';
import SignIn from './SignIn';
import ResumeUpload from './ResumeUpload';
import Subscribe from './Subscribe';
import Autofill from './AutoFill';
import { makeRequest } from '../utils/helpers';
import { checkPremium } from './request';
import {checkIsFormExist} from '../utils/script'

function Popup() {
  const [currentScreen, setCurrentScreen] = useState('SignIn');
  const [loading, setLoading] = useState(false);

  const navigateTo = (screenName: string) => {
    setCurrentScreen(screenName);
  };
  useEffect(() => {
      const cookieDetails = { url: 'https://app.rampedcareers.com/', name: 'ramped-extension-login-token' };
      chrome.cookies.get(cookieDetails, (cookie) => {
        let payload = {
          auth: cookie?.value,
          token: "adsasdadsaddassasdsa"
        }
  
        makeRequest(setLoading, checkPremium, payload, onSuccess, onError);
  
      });
  }, []);
  const onSuccess = async (response: any) => {

    if (response.resume_data) {
      localStorage.setItem('ResumeInformationData', JSON.stringify(response.resume_data));
    }

    if (!response.user_email) {
      navigateTo('SignIn');
      return;
    }

    if (response.response !== "Premium") {
      navigateTo('Subscribe');
      return;
    }

    if (response.resume_uploaded_status) {
      try{
        await checkIsFormExist()
        navigateTo('Autofill');
      } catch {
        navigateTo('SignIn');
      }
    } else {
      navigateTo('ResumeUpload');
    }
  }
  const onError = (response: any) => {
    navigateTo('SignIn');
    console.log(response);
  }

  // Conditional rendering based on currentScreen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'SignIn':
        return <SignIn navigateTo={navigateTo} loading={loading}  />;
      case 'Autofill':
        return <Autofill navigateTo={navigateTo} />;
      case 'ResumeUpload':
        return <ResumeUpload navigateTo={navigateTo} />;
      case 'Subscribe':
        return <Subscribe navigateTo={navigateTo} />;
      default:
        return <SignIn navigateTo={navigateTo} loading={loading} />;
    }
  };

  return (
    <div className="Popup">
      {renderScreen()}
    </div>
  );
}

export default Popup;




