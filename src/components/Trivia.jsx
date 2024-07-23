import React, { useEffect, useState } from 'react';
import useSound from "use-sound";
import play from "../assets/sounds_play.mp3";
import correct from "../assets/sounds_correct.mp3";
import wrong from "../assets/sounds_wrong.mp3";
import bgm from "../assets/bgm.mp3"; // Import the background music file

export default function Trivia({ setStop, setQuestionNumber, questionNumber, questions, setEarned }) {
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [className, setClassName] = useState("answer");

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
    }, [questionNumber, questions]);

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
                    if (questionNumber === 15) {
                        setEarned("5000");
                        setStop(true);
                    } else {
                        if (questions.length !== questionNumber) {
                            setQuestionNumber(prev => prev + 1);
                            setSelectedAnswer(null);
                        } else {
                            setStop(true);
                            setQuestionNumber(1);
                            setSelectedAnswer(null);
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
