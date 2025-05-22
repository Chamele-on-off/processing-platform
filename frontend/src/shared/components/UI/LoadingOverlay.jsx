import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './Loading.css';

const LoadingOverlay = ({ fullScreen = false, tip }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return (
    <div className={`loading-overlay ${fullScreen ? 'full-screen' : ''}`}>
      <Spin 
        indicator={antIcon}
        tip={tip || 'Загрузка...'}
        size="large"
      />
    </div>
  );
};

export default LoadingOverlay;
