import React, { useState } from "react";
import { Tabs, Button, Collapse, Input, message } from "antd";
import starsIcon from "../../assets/images/stars.svg";
import deleteIcon from "../../assets/images/deleteIcon.svg";
import thumbsUp from "../../assets/images/thumbs-up.svg";
import thumbsdown from "../../assets/images/thumbs-down.svg";
import refresh from "../../assets/images/refresh.svg";
import animatingRefresh from "../../assets/images/animatingRefresh.svg";

import clipboard from "../../assets/images/clipboard.svg";
import { RightOutlined } from "@ant-design/icons";

import { makeRequest } from "../../utils/helpers";
import { HelpfullLongQuestion, LongAnswer } from "iframe/interfaces/LongAnswer";
import { fetchHelpFullTextForLongQuestion, fetchLongAnswer } from "../api";

const { Panel } = Collapse;

interface AiQuestionAnswerProps {
  auth: any;
  questionId: number;
  onDelete: (questionId: number) => void;
}

const AiQuestionAnswer: React.FC<AiQuestionAnswerProps> = ({
  onDelete,
  auth,
  questionId,
}) => {
  const [contextText, setContextText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [showTabs, setShowTabs] = useState(false);
  const [activeKey, setActiveKey] = useState("1");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("")

  const handleQuestionChange = (text: string) => {
    setQuestionText(text);
  };

  const handleDeleteQuestion = () => {
    onDelete(questionId);
  };

  const renderInputWithCopy = (label: string) => (
    <>
      <div className="questInputContainer">
        <div className="questInputLabelContainer">
          <div className="question-style">{label}</div>
          <Input
            className="simple-input-field"
            onChange={(e) => handleQuestionChange(e.target.value)}
          />
        </div>
        <img
          className="delete-icon"
          onClick={handleDeleteQuestion}
          src={deleteIcon}
          alt=""
        />
      </div>
    </>
  );

  const genExtra = () => <>{renderInputWithCopy("Questions")}</>;

  const customExpandIcon = (panelProps: any) => {
    const { isActive } = panelProps; // This indicates if the panel is open
    return (
      <RightOutlined
        style={{
          transition: "transform 0.2s",
          transform: `rotate(${isActive ? 270 : 90}deg)`, // Rotate icon when panel is active
        }}
      />
    );
  };

  const handleGenerateResponseClick = async () => {
    if (questionText) {
      await fetchResponseForQuestion();
    }
  };

  const fetchResponseForQuestion = async () => {
    const context = contextText && contextText.trim() !== '' ? contextText : '';
    const payload: LongAnswer = {
      auth: auth,
      token: "adsasdadsaddassasdsa",
      question: questionText,
      context: context,
    };
    makeRequest(setLoading, fetchLongAnswer, payload, fillAnswer, ErrorHandler);
  };

  const fetchResponseForHelpFullLongQuestion = async () => {
    const payload: HelpfullLongQuestion = {
      auth: auth,
      token: "adsasdadsaddassasdsa",
      question: questionText,
    };
    makeRequest(
      setLoading,
      fetchHelpFullTextForLongQuestion,
      payload,
      fillHelpFullTextForLongQuestion,
      ErrorHandler
    );
  };

  const fillHelpFullTextForLongQuestion = async (promise: any) => {
    const response = await promise;
    setShowResponse(true);
    if (response.answer) {
      setActiveKey("1");
      setResponseText(response.answer);
      setSuggestion(response.suggestion);
    } else {
      setActiveKey("2");
      setSuggestion(response.suggestion);
      setContextText(response.answer);
    }
  };

  const fillAnswer = async (promise: any) => {
    const { response } = await promise;
     ;
    setResponseText(response);
    setActiveKey("1");
    setShowResponse(true);
  };

  const ErrorHandler = () => {
    console.log("Something went wrong");
  };

  // const handleClipBoardCopy = async () => {
  //   await navigator.clipboard.writeText(responseText);
  // };
  const handleClipBoardCopy = async () => {
    try {
      await navigator.clipboard.writeText(responseText);
      message.success('Copied to clipboard'); // Show success message
    } catch (error) {
      console.log(error)
      message.error('Failed to copy'); // Show error message
    }
  };

  const items = [
    {
      label: "Response",
      key: "1",
      children: (
        <>
          <p className="answer-header">Response</p>
          <textarea
            className="textarea-response"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Reponse Text ..."
          />
        </>
      ),
    },
    {
      label: "Context",
      key: "2",
      children: (
        <>
          <p className="answer-header">Answer</p>
          <textarea
            className="textarea-response"
            value={contextText}
            onChange={(e) => setContextText(e.target.value)}
            placeholder={suggestion}
          />
        </>
      ),
    },
  ];

  return (
    <Collapse
      key={questionId}
      expandIconPosition="right"
      ghost
      expandIcon={customExpandIcon}
    >
      <Panel key={questionId} header={genExtra()} className="colapse-content">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            marginTop: "0px",
          }}
        >
          {!showResponse && (
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
              // disabled={loading}
              onClick={fetchResponseForHelpFullLongQuestion}
            >
              {/* <img src={starsIcon} width="14px" height="14px" alt="logo" />
              Generate Response */}
              {loading ? (
                <>
                  <img
                    src={refresh}
                    alt="refresh"
                    className={loading ? "spinner" : ""}
                  />
                  <span>Generate Response</span>
                </>
              ) : (
                <>
                  <img src={starsIcon} width="14px" height="14px" alt="logo" />
                  <span>Generate Response</span>
                </>
              )}
            </button>
          )}
        </div>
        {showResponse && (
          <div className="answer-tabs">
            <Tabs
              onChange={(key) => setActiveKey(key)}
              activeKey={activeKey}
              tabBarExtraContent={{
                right:
                  // <Button onClick={() => setShowTabs(false)}>
                  //   <div
                  //     style={{
                  //       display: "flex",
                  //       alignItems: "center",
                  //       marginBottom: "12px",
                  //     }}
                  //   >
                  //     <img
                  //       onClick={handleGenerateResponseClick}
                  //       src={loading ? animatingRefresh : refresh}
                  //       alt=""
                  //       style={{
                  //         width: "20px",
                  //         height: "20px",
                  //         borderRight: "1px solid #04041F1A",
                  //         marginRight: "6px",
                  //         padding: "6px",
                  //         marginBottom: "12px",
                  //       }}
                  //     />
                  //     <img
                  //       src={thumbsUp}
                  //       alt=""
                  //       style={{
                  //         width: "20px",
                  //         height: "20px",
                  //         borderRight: "1px solid #04041F1A",
                  //         padding: "6px",
                  //         marginBottom: "12px",
                  //       }}
                  //     />
                  //     <img
                  //       src={thumbsdown}
                  //       alt=""
                  //       style={{
                  //         width: "20px",
                  //         height: "20px",
                  //         borderRight: "1px solid #04041F1A",
                  //         marginLeft: "4px",
                  //         padding: "6px",
                  //         marginBottom: "12px",
                  //       }}
                  //     />
                  //     <img
                  //       onClick={handleClipBoardCopy}
                  //       src={clipboard}
                  //       alt=""
                  //       style={{
                  //         width: "20px",
                  //         height: "20px",
                  //         marginLeft: "4px",
                  //         padding: "6px",
                  //         marginBottom: "12px",
                  //       }}
                  //     />
                  //   </div>
                  // </Button>
                  responseText ? (
                    <div className="response-section">
                      <button
                        onClick={handleGenerateResponseClick}
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
                  ) : (
                    <button
                      onClick={handleGenerateResponseClick}
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
                    >
                      <img
                        id="gernater-loading"
                        src={loading ? animatingRefresh : refresh}
                        width="14px"
                        height="14px"
                        alt="logo"
                      />
                      <span>Generate Response</span>

                    </button>
                  ),
              }}
              items={items}
              tabPosition="bottom"
            />
          </div>
        )}
      </Panel>
    </Collapse>
  );
};
export default AiQuestionAnswer;
