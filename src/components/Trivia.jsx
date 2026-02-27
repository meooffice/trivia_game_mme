import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import play from "../assets/sounds_play.mp3";
import correct from "../assets/sounds_correct.mp3";
import wrong from "../assets/sounds_wrong.mp3";
import bgm from "../assets/Timer.mp3";
import QuestionBoard from "./QuestionBoard";

export default function Trivia({
  setStop,
  setQuestionNumber,
  questionNumber,
  questions,
  setEarned,
  setIsPlaying,
  onStateChange   // 🔥 NEW PROP
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

  // 🔥 SEND STATE TO APP FOR AUDIENCE
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        question,
        selectedAnswer,
        className,
        showNext,
        showCorrect,
        answersDisabled
      });
    }
  }, [question, selectedAnswer, className, showNext, showCorrect, answersDisabled, onStateChange]);

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
    <QuestionBoard
      question={question}
      selectedAnswer={selectedAnswer}
      className={className}
      showCorrect={showCorrect}
      showNext={showNext}
      answersDisabled={answersDisabled}
      onAnswerClick={handleClick}
      onNextClick={handleNext}
      isClickable={true}
    />
  );
}