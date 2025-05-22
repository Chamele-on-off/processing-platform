import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const ActivityChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: 'Транзакции',
              data: data.transactions,
              borderColor: 'var(--primary)',
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Заявки',
              data: data.orders,
              borderColor: 'var(--secondary)',
              backgroundColor: 'rgba(219, 39, 119, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default ActivityChart;
