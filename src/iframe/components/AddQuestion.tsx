import React from 'react';

const AddQuestion: React.FC = () => {
    const handleScrollToAiAnswer = () => {
        const element = document.getElementById('aiAnswerComponent');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            window.postMessage({ action: 'addAIQuestion' }, '*');

        }
    };

    return (
        <div style={{ position: 'sticky', bottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <button id="add-question" style={{ borderRadius: '6px', cursor: 'pointer', background: '#616EDD', display: 'flex', minWidth: '94px', padding: '12px 24px', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#FAFAFA', textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontStyle: 'normal', fontWeight: 600, lineHeight: '150%', border: 'none' }}
                 onClick={handleScrollToAiAnswer}

                >
                    <div id="profile-spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '12px', height: '12px', animation: 'spin 2s linear infinite', marginRight: '8px', display: 'none' }}></div>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M8.64708 1.39999L9.71474 4.28528L12.6 5.35293L9.71474 6.42059L8.64708 9.30588L7.57943 6.42059L4.69414 5.35293L7.57943 4.28528L8.64708 1.39999Z" stroke="#FAFAFA" stroke-linejoin="round" />
                            <path d="M3.70591 7.98823L4.63856 9.36146L6.01179 10.2941L4.63856 11.2268L3.70591 12.6L2.77326 11.2268L1.40002 10.2941L2.77326 9.36146L3.70591 7.98823Z" stroke="#FAFAFA" stroke-linejoin="round" />
                        </svg>
                    </span>
                    <span>Answer Questions with AI</span>
                </button>
            </div>
        </div>
    );
};

export default AddQuestion;