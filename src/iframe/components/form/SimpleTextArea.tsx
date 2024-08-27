import React, { useState, useEffect } from 'react';
import { Button, Input, Tabs,message } from 'antd';
import refresh from '../../../assets/images/refresh.svg';
import starsIcon from '../../../assets/images/stars.svg';
import { getAuthFromCookie } from '../../../utils/auth';
import './index.css'; // Make sure this path is correct
import { makeRequest } from '../../../utils/helpers';
import { LongAnswer } from '../../../iframe/interfaces/LongAnswer';
import { fetchLongAnswer } from '../../api';
import Spinner from '../Spinner';
import { dividerClasses } from '@mui/material';


import thumbsUp from "../../../assets/images/thumbs-up.svg";
import thumbsdown from "../../../assets/images/thumbs-down.svg";
import animatingRefresh from "../../../assets/images/animatingRefresh.svg";

import clipboard from "../../../assets/images/clipboard.svg";

const { TextArea } = Input;

interface SimpleTextAreaProps {
    onChange: (value: string) => void;
    defaultValue?: string;
    tooltip?: string;
    labelQuestion?: string;

}

const SimpleTextArea: React.FC<SimpleTextAreaProps> = ({
    defaultValue,
    tooltip,
    labelQuestion,
    onChange
}) => {
    // const [value, setValue] = useState<string>(defaultValue || '');
    const [contextText, setContextText] = useState('');
    const [responseText, setResponseText] = useState<string>(defaultValue || '');
    const [auth, setAuth] = useState<string>()
    const [activeTabKey, setActiveTabKey] = useState('1');
    const [loading, setLoading] = useState(false)
    const [answerData, setAnswerData] = useState()
    const [isToolBarShow,setIsToolBarShow]=useState(false)



    useEffect(() => {
        setResponseText(defaultValue || '');
    }, [defaultValue]);

    useEffect(() => {
        // Set the active tab based on whether responseText has content
        setActiveTabKey(responseText ? '1' : '2');
        setIsToolBarShow(responseText ? true : false);
    }, [responseText]);

    // Handler to update local state and propagate changes upwards
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResponseText(e.target.value);
        onChange(e.target.value);
    };

    const handleGenerateResponse = async () => {
        console.log('Generate Response');
        const response = await fetchResponseForQuestion(labelQuestion, contextText); // Use question.text here
    }

    const handleClipBoardCopy = async () => {
        try {
          await navigator.clipboard.writeText(responseText);
          message.success('Copied to clipboard'); // Show success message
        } catch (error) {
          console.log(error)
          message.error('Failed to copy'); // Show error message
        }
      };

    // for Api call 
    useEffect(() => {
        getAuth()
    }, [])
    const getAuth = async () => {
        const cookieAuth = await getAuthFromCookie()
        setAuth(cookieAuth)
        console.log('setAuth', setAuth)
    }

    const fetchResponseForQuestion = async (question: any, contextText: any) => {
        // If contextText is empty or undefined, set it to an empty array
        const context = contextText && contextText.trim() !== '' ? contextText : '';        
        const payload: LongAnswer = {
            auth: auth,
            token: "adsasdadsaddassasdsa", // You might need to handle token dynamically
            question: question,
            context: context,

        }
        makeRequest(setLoading, fetchLongAnswer, payload, fillAnswer, ErrorHandler);
    };
    const fillAnswer = async (promise: any) => {
        const response = await promise
        console.log("fill data calledssssssssssss", response);
        setResponseText(response.response)
        onChange(response.response)
    }

    const ErrorHandler = () => {
        console.log("Something went wrong");
    }

    // tabs data 
    const items = [
        {
            label: 'Response',
            key: '1',
            children: (
                <>
                    {/* <p className='answer-header'>
                    </p> */}

                    <textarea
                        className='textarea-response '
                        value={responseText}
                        onChange={handleChange}

                        placeholder="Enter response here..."
                    />
                </>
            ),
        },
        {
            label: 'Context',
            key: '2',
            children: (
                <>
                    {/* <p className='answer-header'>
                    </p> */}

                    <textarea
                        className='textarea-response '
                        value={contextText}
                        onChange={(e) => setContextText(e.target.value)}
                        placeholder={tooltip}
                    />
                </>

            ),
        },

    ];

    return (
      <div>
        <div className="answer-tabs">
          <Tabs
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            tabBarExtraContent={{
              right: !isToolBarShow ? (
                <button
                  id="add-question-more"
                  className="add-question"
                  onClick={handleGenerateResponse}
                >
                  <img
                    src={loading ? refresh : starsIcon}
                    alt="refresh"
                    className={loading ? "spinner" : "star-img"}
                  />
                  <span>Generate Response</span>
                </button>
              ) : (
                <div className="response-section">
                  <button
                    onClick={handleGenerateResponse}
                    id="generate"
                    className="group-btn"
                    style={{ padding: "0px 6px" }}
                  >
                    <img
                      id="gernater-loading"
                      src={loading ? animatingRefresh : refresh}
                      width="14px"
                      height="14px"
                      alt="logo"
                    />
                  </button>
                  <span className="icon-border"></span>
                  <button
                    id="like"
                    className="group-btn"
                    style={{ padding: "0px 6px" }}
                  >
                    <img id="img2" src={thumbsUp} alt="like" />
                  </button>
                  <span className="icon-border"></span>
                  <button
                    id="dislike"
                    className="group-btn"
                    style={{ padding: "0px 6px" }}
                  >
                    <img id="img3" src={thumbsdown} alt="dislike" />
                  </button>
                  <span className="icon-border"></span>
                  <button
                    onClick={handleClipBoardCopy}
                    id="clipboard-copy"
                    className="group-btn"
                    style={{ padding: "0px 6px" }}
                  >
                    <img id="img1" src={clipboard} alt="copy" />
                  </button>
                </div>
              ),
            }}
            items={items}
            tabPosition="bottom"
          />
        </div>
      </div>
    );
};

export default SimpleTextArea;
