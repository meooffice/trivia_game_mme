import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';

const PlayPauseButton = ({ isPlaying, togglePlayPause }) => (
    
    <button onClick={togglePlayPause} style={{ background: 'none', border: 'none', cursor: 'pointer',}}>
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
    </button>
);

export default PlayPauseButton;
