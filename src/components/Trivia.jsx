import React, { useEffect, useState } from 'react';
import useSound from "use-sound";
import play from "../assets/sounds_play.mp3";
import correct from "../assets/sounds_correct.mp3";
import wrong from "../assets/sounds_wrong.mp3";
import bgm from "../assets/Timer.mp3";
import "./Trivia.css"; // Import the CSS for styling


export default function Trivia({
  setStop,
  setQuestionNumber,
  questionNumber,
  questions,
  setEarned,
  setTimerActive // ✅ Receive timer controller from parent
}) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [className, setClassName] = useState("answer");
  const [answersDisabled, setAnswersDisabled] = useState(false);
  const [clickedOnce, setClickedOnce] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const [correctAnswer] = useSound(correct);
  const [wrongAnswer] = useSound(wrong);
  const [letsPlay] = useSound(play);
  const [playBGM, { stop: stopBGM }] = useSound(bgm, { loop: true });

  useEffect(() => {
    letsPlay();
    playBGM();

    return () => {
      stopBGM();
    };
  }, [letsPlay, playBGM, stopBGM]);

  useEffect(() => {
    setQuestion(questions[questionNumber - 1]);
    setAnswersDisabled(false);
    setSelectedAnswer(null);
    setClickedOnce(false);
    setClassName("answer");
    setShowNext(false);
    if (setTimerActive) setTimerActive(true); // ✅ Resume timer for new question
  }, [questionNumber, questions, setTimerActive]);

  const delay = (duration, callback) => {
    setTimeout(callback, duration);
  };

  const handleClick = (a) => {
    if (answersDisabled) return;

    if (selectedAnswer === a && clickedOnce) {
      setClassName("answer active");
      setAnswersDisabled(true);
      delay(3000, () => setClassName(a.correct ? "answer correct" : "answer wrong"));
      delay(5000, () => {
        if (a.correct) {
          correctAnswer();
          setShowNext(true); // ✅ Show play button
          if (setTimerActive) setTimerActive(false); // ✅ Stop timer
        } else {
          wrongAnswer();
          delay(1000, () => {
            setStop(true);
          });
        }
      });
    } else {
      setSelectedAnswer(a);
      setClickedOnce(true);
      setClassName("answer active");
    }
  };

  const handleNext = () => {
    setShowNext(false);
    if (questionNumber === 15) {
      setEarned("5000");
      setStop(true);
    } else {
      if (questions.length !== questionNumber) {
        setQuestionNumber(prev => prev + 1);
      } else {
        setStop(true);
        setQuestionNumber(1);
      }
    }
  };

  return (
    <div className='trivia'>
      <div className="question">{question?.question}</div>
      <div className="answers">
        {
          question?.answers
            .filter(a => !a.removed)
            .map((a) => (
              <div
                key={a.text}
                className={`${selectedAnswer === a ? className : "answer"}`}
                onClick={() => handleClick(a)}
                style={{ pointerEvents: answersDisabled ? 'none' : 'auto' }}
              >
                {a.text}
              </div>
            ))
        }
      </div>

      {/* ✅ Floating play-style next button */}
      {showNext && (
        <div className="floating-next-button">
          <button className="next-play-button" onClick={handleNext}>
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
