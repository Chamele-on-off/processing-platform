import React from 'react';
import { Row, Col, Tabs } from 'antd';
import OrderFeed from '../components/OrderFeed/OrderFeed';
import PaymentDetailsList from '../components/PaymentDetails/PaymentDetailsList';
import StatsOverview from '../components/TraderStats/StatsOverview';
import ConversionChart from '../components/TraderStats/ConversionChart';
import TimeMetrics from '../components/TraderStats/TimeMetrics';
import VolumeMetrics from '../components/TraderStats/VolumeMetrics';
import './TraderDashboard.css';

const { TabPane } = Tabs;

const TraderDashboard = ({ trader }) => {
  return (
    <div className="trader-dashboard">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <StatsOverview stats={trader.stats} loading={false} />
        </Col>
        
        <Col span={24}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Лента заявок" key="1">
              <OrderFeed traderId={trader.id} />
            </TabPane>
            <TabPane tab="Мои реквизиты" key="2">
              <PaymentDetailsList traderId={trader.id} />
            </TabPane>
            <TabPane tab="Аналитика" key="3">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <ConversionChart stats={trader.stats} loading={false} />
                </Col>
                <Col span={12}>
                  <TimeMetrics stats={trader.stats} loading={false} />
                </Col>
                <Col span={12}>
                  <VolumeMetrics stats={trader.stats} loading={false} />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default TraderDashboard;
