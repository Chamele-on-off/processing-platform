import React from 'react';
import { Card, Spin } from 'antd';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './TraderStats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ConversionChart = ({ stats, loading }) => {
  const data = {
    labels: stats?.conversionHistory?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Конверсия (%)',
        data: stats?.conversionHistory?.map(item => item.value * 100) || [],
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)}%`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`
        }
      }
    }
  };

  return (
    <Card title="Динамика конверсии" className="stats-card">
      <Spin spinning={loading}>
        <div style={{ height: '300px' }}>
          <Line data={data} options={options} />
        </div>
      </Spin>
    </Card>
  );
};

export default ConversionChart;
