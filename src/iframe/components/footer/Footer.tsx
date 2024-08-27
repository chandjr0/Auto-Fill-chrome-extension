import React from 'react';

const Footer: React.FC = () => {
    return (
        <div style={{ position: 'sticky', bottom: 0, zIndex: 99999 }}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', marginTop: '50px', backgroundColor: 'white'}}>
                <button id="add-question" style={{borderRadius: '6px', cursor:'pointer', background: '#616EDD', display: 'flex', minWidth: '94px', padding: '12px 24px', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#FAFAFA', textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontStyle: 'normal', fontWeight: 600, lineHeight: '150%', border: 'none'}}>
                    <div id="profile-spinner" style={{border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '12px', height: '12px', animation: 'spin 2s linear infinite', marginRight: '8px', display: 'none'}}></div>
                    <span>Answer Questions using AI</span>
                </button>
            </div>
        </div>
    );
};  

export default Footer;