import React from 'react';
import { Card, Spin } from 'antd';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './TraderStats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TimeMetrics = ({ stats, loading }) => {
  const data = {
    labels: stats?.timeMetrics?.map(item => item.range) || [],
    datasets: [
      {
        label: 'Среднее время обработки (мин)',
        data: stats?.timeMetrics?.map(item => item.value) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Минуты'
        }
      }
    }
  };

  return (
    <Card title="Метрики времени обработки" className="stats-card">
      <Spin spinning={loading}>
        <div style={{ height: '300px' }}>
          <Bar data={data} options={options} />
        </div>
      </Spin>
    </Card>
  );
};

export default TimeMetrics;
