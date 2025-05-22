import React from 'react';
import { Card, Statistic, Space, Tag } from 'antd';
import { 
  DollarOutlined, 
  WalletOutlined, 
  LockOutlined 
} from '@ant-design/icons';
import './BalanceWidget.css';

const BalanceCard = ({ balance, onDepositClick, onWithdrawClick }) => {
  return (
    <Card className="balance-card" title="Баланс">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Statistic
          title="Доступный баланс"
          value={balance?.available || 0}
          precision={2}
          prefix={<DollarOutlined />}
          suffix="₽"
        />

        <Statistic
          title="Заблокировано"
          value={balance?.locked || 0}
          precision={2}
          prefix={<LockOutlined />}
          suffix="₽"
          valueStyle={{ color: '#cf1322' }}
        />

        <Space>
          <Tag icon={<WalletOutlined />} color="blue">
            Всего: {(balance?.available + balance?.locked)?.toFixed(2)} ₽
          </Tag>
        </Space>

        <Space>
          <button 
            className="action-button deposit-button"
            onClick={onDepositClick}
          >
            Пополнить
          </button>
          <button 
            className="action-button withdraw-button"
            onClick={onWithdrawClick}
            disabled={!balance?.available || balance.available <= 0}
          >
            Вывести
          </button>
        </Space>
      </Space>
    </Card>
  );
};

export default BalanceCard;
