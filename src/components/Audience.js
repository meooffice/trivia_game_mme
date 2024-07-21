import React, { useState } from 'react';
import { Button, Modal, List, Typography, Spin } from 'antd';
import './Audience.css'; // Import your CSS file

const { Title } = Typography;

const books = [
  {
    class: 10,
    books: [
      {
        id: 1,
        name: "Maths",
        link: "https://drive.google.com/file/d/11fjBmtiKkMi4ziGCATPdFjg-pW9I6ubS/view"
      },
      {
        id: 2,
        name: "Science",
        link: "https://drive.google.com/file/d/1BWlRtMows4bNRAut9qS6uLrHJSroE0XH/view"
      }
    ]
  }
];

const Audience = ({ useAudience, isUsed, toggleTimer }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [selectedBookLink, setSelectedBookLink] = useState('');
  const [hasUsedAudience, setHasUsedAudience] = useState(isUsed);
  const [loadingPreview, setLoadingPreview] = useState(false); // Track loading state

  const showModal = () => {
    if (hasUsedAudience) return; // Prevent showing modal if already used

    toggleTimer(false); // Pause the timer
    setIsModalVisible(true);

    // Countdown logic
    let secondsToGo = 60;

    const timer = setInterval(() => {
      secondsToGo -= 1;
      // Optionally update countdown in modal content
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      handleClose();
    }, secondsToGo * 1000);
  };

  const showPreviewModal = (link) => {
    // Modify the link for embedding
    const embedLink = link.replace('/view', '/preview');
    setSelectedBookLink(embedLink);
    setLoadingPreview(true); // Set loading state to true
    setIsPreviewModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    if (!hasUsedAudience) {
      setHasUsedAudience(true); // Mark as used
    }
    toggleTimer(true); // Resume the timer
  };

  const handlePreviewClose = () => {
    setIsPreviewModalVisible(false);
    setSelectedBookLink('');
  };

  // Handle iframe load event
  const handleIframeLoad = () => {
    setLoadingPreview(false); // Set loading state to false when iframe is loaded
  };

  return (
    <>
      <Button
        className={`lifeline ${hasUsedAudience ? 'used' : ''}`}
        onClick={showModal}
        disabled={hasUsedAudience} // Disable button if already used
      >
        <span className="symbol">🕮</span>
      </Button>

      {/* Main Modal */}
      <Modal
        title="Folder of Books"
        visible={isModalVisible}
        onCancel={handleClose}
        footer={null}
        width={1000} // Set the width to 1000 pixels
        className="custom-modal"
        zIndex={1000} // Ensure this is lower than preview modal
      >
        <div>
          {books.map((bookClass) => (
            <div key={bookClass.class} style={{ marginBottom: '16px' }}>
              <Title level={4}>Class {bookClass.class}</Title>
              <List
                bordered
                dataSource={bookClass.books}
                renderItem={(item) => (
                  <List.Item>
                    <Button type="link" onClick={() => showPreviewModal(item.link)}>
                      {item.name}
                    </Button>
                  </List.Item>
                )}
              />
            </div>
          ))}
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="Book Preview"
        visible={isPreviewModalVisible}
        onCancel={handlePreviewClose}
        footer={null}
        width={1000} // Adjust width as needed
        className="ant-modal-preview"
        zIndex={1050} // Higher zIndex to ensure it appears in front
      >
        <div style={{ position: 'relative', height: '600px' }}>
          {loadingPreview && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <Spin size="large" />
            </div>
          )}
          <iframe
            src={selectedBookLink}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Book Preview"
            onLoad={handleIframeLoad} // Set loading state to false on load
            style={{ display: loadingPreview ? 'none' : 'block' }}
          />
        </div>
      </Modal>
    </>
  );
};

export default Audience;
