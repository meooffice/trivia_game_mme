import React, { useEffect, useState } from 'react';
import useSound from "use-sound";
import play from "../assets/sounds_play.mp3";
import correct from "../assets/sounds_correct.mp3";
import wrong from "../assets/sounds_wrong.mp3";
import bgm from "../assets/Timer.mp3"; // Import the background music file

export default function Trivia({ setStop, setQuestionNumber, questionNumber, questions, setEarned }) {
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [className, setClassName] = useState("answer");
    const [answersDisabled, setAnswersDisabled] = useState(false); // New state to manage answer box disabled state
    const [clickedOnce, setClickedOnce] = useState(false); // Track if an answer has been clicked once

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
        setAnswersDisabled(false); // Re-enable answers when a new question is loaded
        setSelectedAnswer(null); // Reset selected answer when a new question is loaded
        setClickedOnce(false); // Reset first click tracker when a new question is loaded
        setClassName("answer"); // Reset className when a new question is loaded
    }, [questionNumber, questions]);

    const delay = (duration, callback) => {
        setTimeout(() => {
            callback();
        }, duration);
    };

    const handleClick = (a) => {
        if (answersDisabled) return; // Prevent clicking if answers are disabled

        if (selectedAnswer === a && clickedOnce) {
            // If the same answer is clicked again, start the process
            setClassName("answer active");
            setAnswersDisabled(true); // Disable all answer boxes when one is clicked
            delay(3000, () => setClassName(a.correct ? "answer correct" : "answer wrong"));
            delay(5000, () => {
                if (a.correct) {
                    correctAnswer();
                    delay(1000, () => {
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
                    });
                } else {
                    wrongAnswer();
                    delay(1000, () => {
                        setStop(true);
                    });
                }
            });
        } else {
            // If a new answer is selected or the first time an answer is clicked
            setSelectedAnswer(a);
            setClickedOnce(true);
            setClassName("answer active");
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
                                style={{ pointerEvents: answersDisabled ? 'none' : 'auto' }} // Apply disabled state
                            >
                                {a.text}
                            </div>
                        ))
                }
            </div>
        </div>
    );
}
