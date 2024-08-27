import React from 'react';
import './Header.css';

const SubHeader: React.FC = () => {
    return (
        <div className="subHeaderContainer">
            <div className='subHeaderRow'>
                <h3 className='header-heading'>
                Application Answers
                </h3>
                <p className='header-details'>
                    Answer the remaining questions to <br />
                    submit your job application
                </p>
            </div>

        </div>
    );
};

export default SubHeader;
