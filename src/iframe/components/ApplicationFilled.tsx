import React from 'react';
import appFilled from "../../assets/images/appFilled.svg"
import './index.css'

const ApplicationFilled: React.FC = () => {
    return (
        <>
            <div id="autoApply-wrapper" style={{ flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch', margin: '24px 16px', textAlign: 'center' }}>
                <div className='app-filled-container'>
                    <img src={appFilled} alt="appfilled" />
                    <h1 id="main-heading" >
                        Application Filled
                    </h1>
                </div>
            </div>
        </>
    );
};

export default ApplicationFilled;
