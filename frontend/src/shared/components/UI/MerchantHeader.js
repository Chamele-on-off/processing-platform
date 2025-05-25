import React from 'react';
import { Button } from 'antd';
import './MerchantHeader.css';

const MerchantHeader = ({ title }) => {
  return (
    <div className="merchant-header">
      <h2>{title}</h2>
      <div className="header-actions">
        <Button type="primary">Action</Button>
      </div>
    </div>
  );
};

export default MerchantHeader;
