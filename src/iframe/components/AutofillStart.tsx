import React, { useEffect } from 'react';
import './index.css'
import { MY_PROFILE_URL } from '../../popup/constant/popupLinks';
type AutofillStartProps = {
  onAutofillClick: () => void;
};

const AutofillStart: React.FC<AutofillStartProps> = ({ onAutofillClick }) => {
  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleClick = () => {
    window.open(MY_PROFILE_URL, "_blank");

  };

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data === "autoFillMessage") {
         
        onAutofillClick();
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  return (
    <div id="autoApply-wrapper" style={{ flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch', margin: '24px 16px', textAlign: 'center' }}>
      <h1 id="main-heading" className='autofill-application' >
        Autofill Application
      </h1>
      <p id="autofill-text" className='autofill-slogen'>
        Autofill this job application with data from your <br /> Ramped Profile
      </p>
      <p className="autofillText">
        <span >or </span> <span className='view-profile' onClick={handleClick}> Edit My Profile</span>
      </p>
      <div id="separator" style={{ alignSelf: 'stretch', height: '1px', borderBottom: '1px solid #04041F0D', margin: '24px 24px 16px 24px' }}></div>
      <div id="login-container" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
        <form id="login-form" onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button id="auto-apply-btn" type="submit" onClick={onAutofillClick} style={{ display: 'flex', padding: '12px 24px', margin: '16px 24px', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', borderRadius: '6px', border: 'none', background: '#616EDD', color: '#FFFFFF', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontStyle: 'normal', fontWeight: 600, lineHeight: '150%' }}>
            <div id="spinner" style={{ display: 'none' }}></div>
            <span>Autofill</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AutofillStart;
