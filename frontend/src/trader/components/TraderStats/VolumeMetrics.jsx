import React from 'react';
import { Card, Spin } from 'antd';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './TraderStats.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const VolumeMetrics = ({ stats, loading }) => {
  const paymentMethods = stats?.volumeByMethod || [];
  
  const data = {
    labels: paymentMethods.map(item => item.method),
    datasets: [
      {
        data: paymentMethods.map(item => item.volume),
        backgroundColor: [
          '#1890ff',
          '#13c2c2',
          '#52c41a',
          '#faad14',
          '#f5222d',
          '#722ed1'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value.toLocaleString()} ₽ (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <Card title="Распределение по методам оплаты" className="stats-card">
      <Spin spinning={loading}>
        <div style={{ height: '300px', width: '100%' }}>
          <Pie data={data} options={options} />
        </div>
      </Spin>
    </Card>
  );
};

export default VolumeMetrics;
