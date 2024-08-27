import { useEffect, useState } from "react";
import { getAuthFromCookie } from "../../utils/auth";
import addIcon from "../../assets/images/add.svg";
import AiQuestionAnswer from "./AiQuestionAnswer";

interface Question {
  id: number;
}

const AiQuestionAnswerListing = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [auth, setAuth] = useState<string>();

  useEffect(() => {
    //Add message listener and call 'handleAddQuestionClick'
    getAuth();
    const listener = (event: MessageEvent) => {
      if (event.data.action === "addAIQuestion") handleAddQuestionClick();
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);
  const getAuth = async () => {
    const cookieAuth = await getAuthFromCookie();
    setAuth(cookieAuth);
  };

  const handleAddQuestionClick = () => {
    const newQuestion: Question = {
      id: Date.now(),
    };
    setQuestions((preState) => [newQuestion, ...preState]);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions((preState) =>
      preState.filter((question) => question.id !== id)
    );
  };

  return (
    <div className="questionContainer"
    id="aiAnswerComponent"
    >
      <div className="question-header-container">
        <h3>Answer Questions with AI</h3>
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
        <div
          className="colapse-question-container"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          {questions.map((question) => (
            <AiQuestionAnswer
              key={question.id}
              questionId={question.id}
              auth={auth}
              onDelete={handleDeleteQuestion}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AiQuestionAnswerListing;
