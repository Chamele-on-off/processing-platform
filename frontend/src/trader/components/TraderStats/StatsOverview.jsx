import React from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { 
  DollarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  SyncOutlined 
} from '@ant-design/icons';
import './TraderStats.css';

const StatsOverview = ({ stats, loading }) => {
  const formatNumber = (num) => num?.toLocaleString() || '0';
  const formatPercent = (num) => `${(num * 100)?.toFixed(1)}%` || '0%';

  return (
    <Card title="Обзор статистики" className="stats-card">
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Общий объем"
              value={formatNumber(stats?.totalVolume)}
              prefix={<DollarOutlined />}
              suffix="₽"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Среднее время"
              value={stats?.avgProcessingTime}
              prefix={<ClockCircleOutlined />}
              suffix="мин"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Конверсия"
              value={formatPercent(stats?.conversionRate)}
              prefix={<CheckCircleOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Активные заявки"
              value={stats?.activeOrders}
              prefix={<SyncOutlined spin />}
            />
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default StatsOverview;
