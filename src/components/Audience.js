import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import './Audience.css';

const Audience = ({ useAudience, isUsed, toggleTimer }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasUsedAudience, setHasUsedAudience] = useState(isUsed);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    let timer;
    if (isModalVisible && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0) {
      handleClose();
    }

    return () => clearInterval(timer);
  }, [isModalVisible, countdown]);

  const showModal = () => {
    if (hasUsedAudience) return;
    toggleTimer(false);
    setCountdown(300);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    if (!hasUsedAudience) {
      setHasUsedAudience(true);
    }
    toggleTimer(true);
  };

  const formatTime = (secs) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Button
        className={`lifeline ${hasUsedAudience ? 'used' : ''}`}
        onClick={showModal}
        disabled={hasUsedAudience}
      >
        <span className="symbol">📞</span>
      </Button>

      <Modal
        visible={isModalVisible}
        onCancel={handleClose}
        footer={null}
        centered
        width={350}
        className="call-modal"
        closable={false}
      >
        <div className="modal-content">
          <h2>Calling a Friend...</h2>
          <div className="calling-animation">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
          <div className="countdown">{formatTime(countdown)}</div>
        </div>
      </Modal>
    </>
  );
};

export default Audience;
