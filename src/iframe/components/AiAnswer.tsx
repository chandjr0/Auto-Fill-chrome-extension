import React, { useEffect, useState } from 'react';
import { Tabs, Button, Collapse, Input } from 'antd';
import addIcon from '../../assets/images/add.svg';
import starsIcon from '../../assets/images/stars.svg';
import deleteIcon from '../../assets/images/deleteIcon.svg';
import thumbsUp from '../../assets/images/thumbs-up.svg';
import thumbsdown from '../../assets/images/thumbs-down.svg';
import refresh from '../../assets/images/refresh.svg';
import clipboard from '../../assets/images/clipboard.svg';
import { RightOutlined } from '@ant-design/icons'; // Importing default right arrow icon

import { getAuthFromCookie } from '../../utils/auth';
import { makeRequest } from '../../utils/helpers';
import { LongAnswer } from 'iframe/interfaces/LongAnswer';
import { fetchLongAnswer } from '../api';


const { Panel } = Collapse;

interface Question {
    id: number;
    showResponse?: boolean; // Added showResponse to track visibility of response for each question
    text?: string; // Store the question text
    


}

const AiAnswer: React.FC = () => {
    const [showCollapse, setShowCollapse] = useState(false);
    const [showTabs, setShowTabs] = useState(false);
    const [contextText, setContextText] = useState('');
    const [responseText, setResponseText] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [auth, setAuth] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [answerData, setAnswerData] = useState()
    console.log('answerData', answerData)


    useEffect(() => {
        getAuth()
    }, [])
    const getAuth = async () => {
        const cookieAuth = await getAuthFromCookie()
        setAuth(cookieAuth)
        console.log('setAuth', setAuth)
    }

    const fetchResponseForQuestion = async (question: any, contextText: any) => {
           const payload: LongAnswer = {
            auth: auth,
            token: "adsasdadsaddassasdsa", // You might need to handle token dynamically
            question: question,
            context: contextText,

        }
        makeRequest(setLoading, fetchLongAnswer, payload, fillAnswer, ErrorHandler);
    };
    const fillAnswer = async (promise: any) => {
        const {response} = await promise
        console.log("fill data calledssssssssssss", response);

        //  setAnswerData(()=>response)
    }

    const ErrorHandler = () => {
        console.log("Something went wrong");
    }

    const handleQuestionChange = (id: number, text: string) => {
        setQuestions(preState => preState.map(question => {
            if (question.id === id) {
                return { ...question, text };
            }
            return question;
        }));
    };


    const items = [
        {
            label: 'Response',
            key: '1',
            children: (
                <>
                    <p className='answer-header'>
                        Answer
                    </p>
                    
                    <textarea
                        className='textarea-response'
                        // value={responseText}
                        value={answerData}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Enter context here..."
                    />
                </>

            ),
        },
        {
            label: 'Context',
            key: '2',
            children: (
                <>
                    <p className='answer-header'>
                        Answer
                    </p>
                    <textarea
                      className='textarea-response'
                       value={contextText}
                        onChange={(e) => setContextText(e.target.value)}

                        placeholder="Enter response here..."
                    />
                </>
            ),
        },
    ];

    console.log(questions)

    const renderInputWithCopy = (placeholder: string, label: string, id: number) => (
        <>
            <div className='questInputContainer'>
                <div className='questInputLabelContainer'>
                    <div className='question-style'>
                        {label}
                    </div>
                    <Input
                        placeholder={placeholder}
                        className='simple-input-field'
                        onChange={(e) => handleQuestionChange(id, e.target.value)} // Update the question text on change

                    />
                </div>
                <img className='delete-icon'
                    onClick={() => handleDeleteQuestion(id)}

                    src={deleteIcon} alt="" />
            </div>

        </>
    );

    const handleAddQuestionClick = () => {
        const newQuestion: Question = {
            id: Date.now(),
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleDeleteQuestion = (id: number) => {
        setQuestions(preState=>preState.filter(question => question.id !== id));
    };

    const handleGenerateResponseClick = async (id: number) => {
        const questionIndex = questions.findIndex(q => q.id === id);
        console.log("Question Index", questionIndex)
        if (questionIndex !== -1) {
            const question = questions[questionIndex];
            if (question.text) { // Ensure there's a question text before making the request
                const response = await fetchResponseForQuestion(question.text, contextText); 

                console.log("AI Response", response)
                // Use question.text here
                setQuestions(prevState => prevState.map(q =>
                    q.id === id ? { ...q, response, showResponse: true } : q
                ));
            }
        }
    };

    const genExtra = (id: number) => (
        <>
            {renderInputWithCopy("First Name", "Questions", id)}

        </>
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
            <div className='questionContainer'
                id="aiAnswerComponent"
            >
                <div className='question-header-container'>
                <h3 >Answer Questions with AI</h3>
                <button
                    id="add-question-more"
                    className="add-question"
                    onClick={handleAddQuestionClick}
                >
                    <img src={addIcon} alt="plus" />
                    <span>Add Question</span>
                </button>
                </div>
                {questions.length > 0 && (
                    <div className='colapse-question-container' style={{ border: "1px solid rgba(0, 0, 0, 0.1)" /* Adjust your border style here */ }}>
                        {questions.map((question) => (
                            <Collapse
                                key={question.id}
                                expandIconPosition="right"
                                ghost
                                expandIcon={customExpandIcon} 

                            >
                                <Panel
                                    header={genExtra(question.id)}
                                    key={String(question.id)}
                                    className='colapse-content'>
                                    <div style={{ display: "flex", justifyContent: "flex-end", width: '100%', marginTop: "0px" }}>
                                        {!question.showResponse && (
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
                                                    cursor: "pointer",
                                                    fontFamily: "'Inter', sans-serif",
                                                }}
                                                onClick={() => handleGenerateResponseClick(question.id)}
                                            >
                                                <img src={starsIcon} width="14px" height="14px" alt="logo" />
                                                Generate Response
                                            </button>
                                        )}
                                    </div>
                                    {question.showResponse && (
                                        <div className='answer-tabs'>
                                        <Tabs 
                                        
                                        tabBarExtraContent={{
                                            right: <Button onClick={() => setShowTabs(false)}>
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                                    <img src={refresh} alt="" style={{ width: '20px', height: '20px', borderRight: '1px solid #04041F1A', marginRight: '6px', padding: '6px', marginBottom: '12px' }} />
                                                    <img src={thumbsUp} alt="" style={{ width: '20px', height: '20px', borderRight: '1px solid #04041F1A', padding: '6px', marginBottom: '12px' }} />
                                                    <img src={thumbsdown} alt="" style={{ width: '20px', height: '20px', borderRight: '1px solid #04041F1A', marginLeft: '4px', padding: '6px', marginBottom: '12px' }} />
                                                    <img src={clipboard} alt="" style={{ width: '20px', height: '20px', marginLeft: '4px', padding: '6px', marginBottom: '12px' }} />
                                                </div>
                                            </Button>
                                        }} items={items} tabPosition="bottom" />
                                        </div>
                                    )}
                                </Panel>
                            </Collapse>
                        ))}
                    </div>
                )}
            </div>

        </>
    );
};

export default AiAnswer;