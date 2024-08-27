import React, { useState } from 'react';
import { Tabs, Button, Collapse, Input } from 'antd';
import addIcon from '../../assets/images/add.svg';
import starsIcon from '../../assets/images/stars.svg';
import { RightOutlined } from '@ant-design/icons'; // Importing default right arrow icon


const { Panel } = Collapse;

const AiAnswerOld: React.FC = () => {
    const [showCollapse, setShowCollapse] = useState(false);
    const [showTabs, setShowTabs] = useState(false);

    const [contextText, setContextText] = useState('');
    const [responseText, setResponseText] = useState('');

    const items = [
        {
            label: 'Context',
            key: '1',
            children: (
                <textarea
                    style={{
                        width: '166%',
                        minHeight: '160px',
                        padding: '10px',
                        fontFamily: 'Inter, sans-serif',
                        border: '1px solid rgba(4, 4, 31, 0.10)',
                        borderRadius: '6px',
                        resize: 'none',
                    }}
                    value={contextText}
                    onChange={(e) => setContextText(e.target.value)}
                    placeholder="Enter context here..."
                />
            ),
        },
        {
            label: 'Response',
            key: '2',
            children: (
                <textarea
                    style={{
                        width: '166%',
                        minHeight: '160px',
                        padding: '10px',
                        fontFamily: 'Inter, sans-serif',
                        border: '1px solid rgba(4, 4, 31, 0.10)',
                        borderRadius: '6px',
                        resize: 'none',
                    }}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter response here..."
                />
            ),
        },
    ];

    const handleAddQuestionClick = () => {
        setShowCollapse(true);
    };

    const handleGenerateResponseClick = () => {
        setShowTabs(true);
    };
    const renderStyledHeader = (text: string) => (
        <div style={{
            color: 'var(--System-Primary, rgba(4, 4, 31, 0.80))',
            fontFamily: "'Inter', sans-serif",
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '150%',
        }}>
            {text}
        </div>
    );

    const customExpandIcon = (panelProps: any) => {
        const { isActive } = panelProps; // This indicates if the panel is open
        return (
            <RightOutlined
                style={{
                    transition: 'transform 0.2s',
                    transform: `rotate(${isActive ? 270 : 90}deg)`, // Rotate icon when panel is active
                }}
            />
        );
    };

    return (
        <>
            {/* <div style={{color: "#04041F1A", padding: "4px", textAlign: "center", opacity: 0.8, marginBottom: "50px", marginTop: "50px"}}>
                <hr style={{width: "80%", color:"#04041F1A", opacity: 0.8 }} />
            </div> */}
            <Collapse expandIconPosition="end"
                expandIcon={customExpandIcon} // Use the custom expand icon function
                ghost>
                <Panel header={renderStyledHeader("Application Questions AI")} key="5">
                    <div className='addQuestContainer'>
                        <button
                            id="add-question-more"
                            className="add-question"
                            style={{ cursor: "pointer", padding: "4px 16px", borderRadius: "6px", border: "1px solid rgba(4, 4, 31, 0.15)", background: "#FFF", color: "rgba(4, 4, 31, 0.80)", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontStyle: "normal", gap: "6px", fontWeight: 500, lineHeight: "150%", height: "32px", display: "flex", alignItems: "center" }}
                            onClick={handleAddQuestionClick}
                        >
                            <img src={addIcon} alt="plus" />
                            <span>Add Question</span>
                        </button>
                    </div>

                    <div className='questionContent'>
                        <div className='questInput'>
                        <p className='questPara'>Question</p>
                            <Input placeholder="Enter Question" />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", width: '100%', marginTop: "0px" }}>
                                <button
                                    id="ask-question"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "4px 16px",
                                        justifyContent: "center",
                                        gap: "4px",
                                        borderRadius: "6px",
                                        border: "1px solid rgba(4, 4, 31, 0.15)",
                                        background: "#FFF",
                                        cursor: "pointer"
                                    }}
                                    onClick={handleGenerateResponseClick}
                                >
                                    <img src={starsIcon} width="14px" height="14px" alt="logo" />
                                    Generate Response
                                </button>
                            </div>
                            
                        {showTabs && (
                            <Tabs rootClassName='answer-tabs' 
                            tabBarExtraContent={{ right: <Button onClick={() => setShowTabs(true)}>

                            </Button> }} 
                            
                            items={items} tabPosition="bottom" />
                        )}

                    </div>



                </Panel>
            </Collapse>

        </>
    );
};

export default AiAnswerOld;