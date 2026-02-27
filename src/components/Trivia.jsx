// Trivia.jsx
import React, { useEffect, useState } from 'react';
import useSound from "use-sound";
import play from "../assets/sounds_play.mp3";
import correct from "../assets/sounds_correct.mp3";
import wrong from "../assets/sounds_wrong.mp3";
import bgm from "../assets/Timer.mp3";
import "./Trivia.css";

export default function Trivia({
  setStop,
  setQuestionNumber,
  questionNumber,
  questions,
  setEarned,
  setIsPlaying
}) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [className, setClassName] = useState("answer");
  const [answersDisabled, setAnswersDisabled] = useState(false);
  const [clickedOnce, setClickedOnce] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);

  const [correctAnswer] = useSound(correct);
  const [wrongAnswer] = useSound(wrong);
  const [letsPlay] = useSound(play);
  const [playBGM, { stop: stopBGM }] = useSound(bgm, { loop: true });

  useEffect(() => {
    letsPlay();
    playBGM();
    return () => stopBGM();
  }, [letsPlay, playBGM, stopBGM]);

  useEffect(() => {
    setQuestion(questions[questionNumber - 1]);
    setAnswersDisabled(false);
    setSelectedAnswer(null);
    setClickedOnce(false);
    setClassName("answer");
    setShowNext(false);
    setShowCorrect(false);
    if (setIsPlaying) setIsPlaying(true);
  }, [questionNumber, questions, setIsPlaying]);

  const delay = (duration, callback) => {
    setTimeout(callback, duration);
  };

  const handleClick = (a) => {
    if (answersDisabled) return;

    if (selectedAnswer === a && clickedOnce) {

      if (setIsPlaying) setIsPlaying(false);

      setClassName("answer active");
      setAnswersDisabled(true);

      if (a.correct) {

        delay(3000, () => {
          setClassName("answer correct");
        });

        delay(5000, () => {
          correctAnswer();

          // ✅ IF LAST QUESTION → DIRECT FINISH
          if (questionNumber === questions.length) {
            setEarned("5000");
            setStop(true);
          } else {
            setShowNext(true);
          }
        });

      } else {

        delay(3000, () => {
          setClassName("answer wrong");
        });

        delay(4500, () => {
          setShowCorrect(true);
          wrongAnswer();
        });

        delay(5500, () => {
          setShowNext(true);
        });
      }

    } else {
      setSelectedAnswer(a);
      setClickedOnce(true);
      setClassName("answer active");
    }
  };

  const handleNext = () => {
    setShowNext(false);

    if (selectedAnswer?.correct) {
      if (questions.length !== questionNumber) {
        setQuestionNumber(prev => prev + 1);
      } else {
        setStop(true);
      }
    } else {
      setStop(true);
    }
  };

  return (
    <div className='trivia'>
      <div className="question">{question?.question}</div>

      <div className="answers">
        {question?.answers
          .filter(a => !a.removed)
          .map((a, index) => (
            <div
              key={a.text}
              className={`${
                selectedAnswer === a
                  ? className
                  : showCorrect && a.correct
                  ? "answer correct"
                  : "answer"
              }`}
              onClick={() => handleClick(a)}
              style={{ pointerEvents: answersDisabled ? 'none' : 'auto' }}
            >
              <span className="answer-label">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="answer-text">{a.text}</span>
            </div>
          ))}
      </div>

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