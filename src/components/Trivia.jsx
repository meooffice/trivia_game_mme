import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import play from "../assets/sounds_play.mp3";
import correct from "../assets/sounds_correct.mp3";
import wrong from "../assets/sounds_wrong.mp3";
import bgm from "../assets/Timer.mp3";
import "./Trivia.css"; // Import the CSS for styling

export default function Trivia({ setStop, setQuestionNumber, questionNumber, questions, setEarned, setIsPlaying }) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [className, setClassName] = useState("answer");
  const [answersDisabled, setAnswersDisabled] = useState(false);
  const [clickedOnce, setClickedOnce] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const [correctAnswer] = useSound(correct);
  const [wrongAnswer] = useSound(wrong);
  const [letsPlay] = useSound(play);
  const [playBGM, { stop: stopBGM }] = useSound(bgm, { loop: true });

  useEffect(() => {
    letsPlay();
    setTimeout(() => {
      playBGM(); // Delay start after letsPlay sound
    }, 500);
    return () => stopBGM();
  }, []);

  useEffect(() => {
    setQuestion(questions[questionNumber - 1]);
    setAnswersDisabled(false);
    setSelectedAnswer(null);
    setClickedOnce(false);
    setClassName("answer");
    setShowNextButton(false);
    setIsPlaying(true); // Resume timer
  }, [questionNumber, questions]);

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
          setIsPlaying(false); // Pause timer
          setShowNextButton(true); // Show next button
        } else {
          wrongAnswer();
          delay(1000, () => setStop(true));
        }
      });
    } else {
      setSelectedAnswer(a);
      setClickedOnce(true);
      setClassName("answer active");
    }
  };

  const handleNext = () => {
    setShowNextButton(false);
    if (questionNumber === 15) {
      setEarned("5000");
      setStop(true);
    } else {
      setQuestionNumber((prev) => prev + 1);
    }
  };

  return (
    <div className="trivia">
         {showNextButton && (
        <button
          className="next-button"
          onClick={handleNext}
        >
          ▶
        </button>
      )}
      <div className="question">{question?.question}</div>
      <div className="answers">
        {question?.answers
          .filter((a) => !a.removed)
          .map((a) => (
            <div
              key={a.text}
              className={`${selectedAnswer === a ? className : "answer"}`}
              onClick={() => handleClick(a)}
              style={{ pointerEvents: answersDisabled ? "none" : "auto" }}
            >
              {a.text}
            </div>
          ))}
      </div>

     
    </div>
  );
}
