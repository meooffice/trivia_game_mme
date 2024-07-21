import React, { useRef, useState } from 'react';
import { GithubLogo } from "phosphor-react";
import useSound from "use-sound";
import game from "../assets/main.mp3";

export default function Start({ setUserName, userName }) {
    // Error msg
    const [error, setError] = useState(false);
    // Input ref
    const inputRef = useRef();

    const [playGame, { stop }] = useSound(game);

    const handleClick = () => {
        // If the input is empty, set error to true; otherwise, set the value to the username
        if (inputRef.current.value === "") {
            setError(true);
        } else {
            // Stop the sound
            stop();
            setUserName(inputRef.current.value);
            enterFullScreen();
        }
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

    return (
        <div className='start'>
            <div className="content">
                <div className="github">
                    <a href="https://github.com/Signo" target='_blank' rel='noreferrer'>
                        <GithubLogo size={2} />
                    </a>
                </div>
                <div className="wrapper">
                    <label>Enter Your Username To Start </label>
                    <input type="text" placeholder='Enter Your Username' className='startInput' ref={inputRef} onFocus={() => playGame()} />
                    {error && <code>Enter username!</code>}
                    <div className="btn">
                        <button className='startButton' onClick={handleClick}>Start Quiz</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
