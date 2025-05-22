import React from 'react';
import { Button, Popover } from 'antd';
import { 
  PlusCircleOutlined,
  BankOutlined,
  CreditCardOutlined,
  QrcodeOutlined 
} from '@ant-design/icons';
import './BalanceWidget.css';

const DepositButton = ({ onQuickDeposit }) => {
  const quickDepositMethods = [
    { method: 'sbp', label: 'СБП', icon: <BankOutlined /> },
    { method: 'card', label: 'Карта', icon: <CreditCardOutlined /> },
    { method: 'qr', label: 'QR', icon: <QrcodeOutlined /> }
  ];

  const content = (
    <div className="quick-deposit-methods">
      {quickDepositMethods.map(item => (
        <Button 
          key={item.method}
          icon={item.icon}
          type="text"
          block
          onClick={() => onQuickDeposit(item.method)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );

  return (
    <Popover 
      content={content} 
      title="Быстрое пополнение" 
      trigger="click"
      placement="bottomRight"
    >
      <Button 
        type="primary" 
        icon={<PlusCircleOutlined />}
        className="quick-deposit-button"
      >
        Быстрый депозит
      </Button>
    </Popover>
  );
};

export default DepositButton;
