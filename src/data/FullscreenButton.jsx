import React from 'react';
import { Button } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

const FullscreenButton = ({ isFullscreen, toggleFullscreen }) => (
    <Button
        onClick={toggleFullscreen}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
    >
        {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
    </Button>
);

export default FullscreenButton;
