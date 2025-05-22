import React from 'react';
import { FaUsers, FaExchangeAlt, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';

const StatsCards = ({ users, transactions, orders }) => {
  const cards = [
    {
      title: 'Пользователи',
      value: users.totalUsers,
      change: '+12%',
      icon: <FaUsers size={24} />,
      color: 'var(--primary)'
    },
    {
      title: 'Трейдеры',
      value: users.activeTraders,
      change: '+5%',
      icon: <FaUsers size={24} />,
      color: 'var(--secondary)'
    },
    {
      title: 'Транзакции',
      value: transactions.totalCount,
      change: '+24%',
      icon: <FaExchangeAlt size={24} />,
      color: 'var(--success)'
    },
    {
      title: 'Объем',
      value: `$${transactions.totalVolume.toLocaleString()}`,
      change: '+18%',
      icon: <FaMoneyBillWave size={24} />,
      color: 'var(--info)'
    },
    {
      title: 'Заявки',
      value: orders.totalOrders,
      change: '-3%',
      icon: <FaClipboardList size={24} />,
      color: 'var(--warning)'
    }
  ];

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div key={index} className="stats-card" style={{ borderLeft: `4px solid ${card.color}` }}>
          <div className="stats-icon" style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className="stats-content">
            <h3>{card.title}</h3>
            <p className="stats-value">{card.value}</p>
            <p className="stats-change" style={{ color: card.change.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>
              {card.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
