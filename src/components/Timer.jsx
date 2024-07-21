import { useEffect, useState } from 'react';

export default function Timer({ setStop, questionNumber, resetTimer, setResetTimer, isPlaying, setIsPlaying }) {
    const [timer, setTimer] = useState(120);

    useEffect(() => {
        if (timer === 0) {
            setStop(true);
            return;
        }

        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isPlaying, timer, setStop]);

    useEffect(() => {
        setTimer(120);
    }, [questionNumber]);

    useEffect(() => {
        if (resetTimer) {
            setTimer(120);
            setResetTimer(false);
        }
    }, [resetTimer, setResetTimer]);

    const handleClick = () => {
        setIsPlaying(prev => !prev);
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer', fontSize: '2rem' }}>
            <p>{timer}</p>
        </div>
    );
}
