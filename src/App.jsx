import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { MoneyPyramid } from "./data/MoneyPyramid";
import Trivia from "./components/Trivia";
import Timer from "./components/Timer";
import Start from "./components/Start";
import { Earned } from "./components/Earned";
import { fetchQuestions } from './data/questions';
import FiftyFifty from './data/FiftyFifty'; // Update import path if needed
import Phone from './data/Phone'; // Update import path if needed
import Audience from './data/Audience'; // Update import path if needed

require('dotenv').config();
function App() {
  const [userName, setUserName] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [stop, setStop] = useState(false);
  const [earned, setEarned] = useState("0");
  const [questions, setQuestions] = useState([]);
  const [isFiftyFiftyUsed, setIsFiftyFiftyUsed] = useState(false);
  const [isPhoneUsed, setIsPhoneUsed] = useState(false);
  const [isAudienceUsed, setIsAudienceUsed] = useState(false);
  const [resetTimer, setResetTimer] = useState(false); // Add state to manage timer reset

  const MoneyPyramidData = useMemo(() => MoneyPyramid, []);

  useEffect(() => {
    fetchQuestions().then(fetchedQuestions => {
      setQuestions(fetchedQuestions);
    });
  }, []);

  useEffect(() => {
    if (questions.length && questionNumber <= questions.length) {
      setEarned(MoneyPyramid.find((m) => m.id === questionNumber - 1)?.amount || "0");
    }
  }, [questionNumber, questions]);

  const convert = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const useFiftyFifty = () => {
    const currentQuestion = questions[questionNumber - 1];
    if (currentQuestion) {
      const incorrectAnswers = currentQuestion.answers.filter((answer) => !answer.correct);
      const answersToRemove = incorrectAnswers.slice(0, 2);
      const updatedAnswers = currentQuestion.answers.map((answer) => {
        if (answersToRemove.includes(answer)) {
          return { ...answer, removed: true };
        }
        return answer;
      });

      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions[questionNumber - 1] = { ...currentQuestion, answers: updatedAnswers };
        return newQuestions;
      });
    }

    setIsFiftyFiftyUsed(true);
  };

  const usePhone = () => {
    setIsPhoneUsed(true);
    setResetTimer(true); // Set the timer reset state to true
  };

  const useAudience = () => {
    setIsAudienceUsed(true);
  };

  const enterFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  };

  const handleStart = (name) => {
    setUserName(name);
    enterFullScreen();
  };

  return (
    <div className="app">
      {userName ? (
        <>
          <div className="main">
            {stop ? (
              <Earned earned={earned} setUserName={setUserName} userName={userName} setStop={setStop} setQuestionNumber={setQuestionNumber} setEarned={setEarned} />
            ) : (
              <>
                <div className="top">
                  <div className="timer">
                    <Timer setStop={setStop} questionNumber={questionNumber} resetTimer={resetTimer} setResetTimer={setResetTimer} />
                  </div>
                </div>
                <div className="bottom">
                  <Trivia setStop={setStop} setQuestionNumber={setQuestionNumber} questionNumber={questionNumber} questions={questions} />
                </div>
              </>
            )}
          </div>
          <div className="pyramid">
            <ul className="moneyList">
              {MoneyPyramidData.map((money) => (
                <li className={questionNumber === money.id ? "moneyListItem active" : "moneyListItem"} key={money.id}>
                  <span className="moneyListItemNumber">{money.id}</span>
                  <span className="moneyListItemAmount">₹ {convert(money.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lifelines">
            <FiftyFifty useFiftyFifty={useFiftyFifty} isUsed={isFiftyFiftyUsed} />
            <Phone usePhone={usePhone} isUsed={isPhoneUsed} />
            <Audience useAudience={useAudience} isUsed={isAudienceUsed} />
          </div>
        </>
      ) : (
        <Start setUserName={handleStart} userName={userName} />
      )}
    </div>
  );
}

export default App;
