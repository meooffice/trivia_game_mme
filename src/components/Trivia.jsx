import React, { useEffect, useState } from 'react';
import useSound from "use-sound";
import play from "../assets/sounds_play.mp3";
import correct from "../assets/sounds_correct.mp3";
import wrong from "../assets/sounds_wrong.mp3";
import bgm from "../assets/bgm.mp3"; // Import the background music file

export default function Trivia({ setStop, setQuestionNumber, questionNumber, questions }) {
    // state for a single question 
    const [question, setQuestion] = useState(null);
    // state for the selected answer
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    // state for the class names that cause animation on the selected option
    const [className, setClassName] = useState("answer");

    // sound for correct answer
    const [correctAnswer] = useSound(correct);
    // sound for wrong answer
    const [wrongAnswer] = useSound(wrong);
    // initial sound for the start of the quiz
    const [letsPlay] = useSound(play);
    // background music
    const [playBGM, { stop: stopBGM }] = useSound(bgm, { loop: true });

    useEffect(() => {
        // play the initial sound and background music on component mount
        letsPlay();
        playBGM();
        
        // Cleanup on unmount
        return () => {
            stopBGM();
        };
    }, [letsPlay, playBGM, stopBGM]);

    useEffect(() => {
        // setting the question from the list of questions
        setQuestion(questions[questionNumber - 1]);
    }, [questionNumber, questions]);

    // Custom function for timeout with duration and a callback function as parameters
    const delay = (duration, callback) => {
        setTimeout(() => {
            callback();
        }, duration);
    };

    const handleClick = (a) => {
        setSelectedAnswer(a);
        setClassName("answer active");
        delay(3000, () => setClassName(a.correct ? "answer correct" : "answer wrong"));
        delay(5000, () => {
            if (a.correct) {
                correctAnswer();
                delay(1000, () => {
                    if (questions.length !== questionNumber) {
                        setQuestionNumber(prev => prev + 1);
                        setSelectedAnswer(null);
                    } else {
                        setStop(true);
                        setQuestionNumber(1);
                        setSelectedAnswer(null);
                    }
                });
            } else {
                wrongAnswer();
                delay(1000, () => {
                    setStop(true);
                });
            }
        });
    };

    return (
        <div className='trivia'>
            <div className="question">{question?.question}</div>
            <div className="answers">
                {
                    question?.answers
                        .filter(a => !a.removed) // Filter out removed answers
                        .map((a) => (
                            <div 
                                key={a.text} 
                                className={selectedAnswer === a ? className : "answer"} 
                                onClick={() => handleClick(a)}
                            >
                                {a.text}
                            </div>
                        ))
                }
            </div>
        </div>
    );
}
