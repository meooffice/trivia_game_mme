import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { MoneyPyramid } from "./data/MoneyPyramid";
import Trivia from "./components/Trivia";
import Timer from "./components/Timer";
import Start from "./components/Start";
import { Earned } from "./components/Earned";
import { fetchQuestions } from "./data/questions";
import FiftyFifty from "./components/FiftyFifty";
import Phone from "./components/Phone";
import Audience from "./components/Audience";
import gifImage from "./assets/giff.gif";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const APP_PASSWORD = "secret123";

  const [userName, setUserName] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [stop, setStop] = useState(false);
  const [earned, setEarned] = useState("0");
  const [questions, setQuestions] = useState([]);
  const [isFiftyFiftyUsed, setIsFiftyFiftyUsed] = useState(false);
  const [isPhoneUsed, setIsPhoneUsed] = useState(false);
  const [isAudienceUsed, setIsAudienceUsed] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const MoneyPyramidData = useMemo(() => MoneyPyramid, []);

  useEffect(() => {
    fetchQuestions().then((fetchedQuestions) => {
      setQuestions(fetchedQuestions);
    });
  }, []);

  useEffect(() => {
    if (questions.length && questionNumber <= questions.length) {
      setEarned(
        MoneyPyramid.find((m) => m.id === questionNumber - 1)?.amount || "0"
      );
    }
  }, [questionNumber, questions]);

  const convert = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const useFiftyFifty = () => {
    const currentQuestion = questions[questionNumber - 1];
    if (currentQuestion) {
      const incorrectAnswers = currentQuestion.answers.filter(
        (answer) => !answer.correct
      );
      const answersToRemove = incorrectAnswers.slice(0, 2);
      const updatedAnswers = currentQuestion.answers.map((answer) => {
        if (answersToRemove.includes(answer)) {
          return { ...answer, removed: true };
        }
        return answer;
      });

      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions[questionNumber - 1] = {
          ...currentQuestion,
          answers: updatedAnswers,
        };
        return newQuestions;
      });
    }

    setIsFiftyFiftyUsed(true);
  };

  const usePhone = () => {
    setIsPhoneUsed(true);
    setResetTimer(true);
  };

  const useAudience = () => {
    setIsAudienceUsed(true);
  };

  const toggleTimer = (play) => {
    setIsPlaying(play);
  };

  const enterFullScreen = () => {
    const element = document.documentElement;

    try {
      if (element.requestFullscreen) {
        element.requestFullscreen().catch((err) =>
          console.error("Error requesting fullscreen:", err)
        );
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen().catch((err) =>
          console.error("Error requesting fullscreen (Firefox):", err)
        );
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen().catch((err) =>
          console.error("Error requesting fullscreen (Webkit):", err)
        );
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen().catch((err) =>
          console.error("Error requesting fullscreen (IE/Edge):", err)
        );
      } else {
        console.error("Full-Screen API is not supported.");
      }
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }
  };

  const handleStart = (name) => {
    setUserName(name);
    setTimeout(enterFullScreen, 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-screen">
        <img src={gifImage} alt="Loading animation" className="auth-gif" />
        <h2>Enter Password to Start</h2>
        <input
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button
          onClick={() => {
            if (passwordInput === APP_PASSWORD) {
              setIsAuthenticated(true);
              setPasswordError("");
            } else {
              setPasswordError("Incorrect password");
            }
          }}
        >
          Submit
        </button>
        {passwordError && <p>{passwordError}</p>}
      </div>
    );
  }

  return (
    <div className="app">
      {userName ? (
        <>
          <div className="main">
            {stop ? (
              <Earned
                earned={earned}
                setUserName={setUserName}
                userName={userName}
                setStop={setStop}
                setQuestionNumber={setQuestionNumber}
                setEarned={setEarned}
              />
            ) : (
              <>
                <div className="top">
                  <div className="timer">
                    <Timer
                      setStop={setStop}
                      questionNumber={questionNumber}
                      resetTimer={resetTimer}
                      setResetTimer={setResetTimer}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                    />
                  </div>
                </div>
                <div className="bottom">
                  <Trivia
                    setStop={setStop}
                    setQuestionNumber={setQuestionNumber}
                    questionNumber={questionNumber}
                    questions={questions}
                    setEarned={setEarned}
                    setIsPlaying={setIsPlaying}   // ✅ correct prop
                  />
                </div>
              </>
            )}
          </div>
          <div className="pyramid">
            <ul className="moneyList">
              {MoneyPyramidData.map((money) => (
                <li
                  className={
                    questionNumber === money.id
                      ? "moneyListItem active"
                      : "moneyListItem"
                  }
                  key={money.id}
                >
                  <span className="moneyListItemNumber">{money.id}</span>
                  <span className="moneyListItemAmount">
                    ₹ {convert(money.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {!stop && (
            <div className="lifelines">
              <FiftyFifty
                useFiftyFifty={useFiftyFifty}
                isUsed={isFiftyFiftyUsed}
              />
              <Phone usePhone={usePhone} isUsed={isPhoneUsed} />
              <Audience
                useAudience={useAudience}
                isUsed={isAudienceUsed}
                toggleTimer={toggleTimer}
              />
            </div>
          )}
        </>
      ) : (
        <Start setUserName={handleStart} userName={userName} />
      )}
    </div>
  );
}

export default App;
