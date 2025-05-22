import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Tabs, Card } from 'antd';
import BalanceWidget from '../components/BalanceWidget/BalanceWidget';
import OrderForm from '../components/OrderForm/OrderForm';
import merchantApi from '../services/merchantApi';
import './MerchantDashboard.css';

const { TabPane } = Tabs;

const MerchantDashboard = ({ merchantId }) => {
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('balance');

  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        setLoading(true);
        const [merchantData, paymentDetails] = await Promise.all([
          merchantApi.getMerchant(merchantId),
          merchantApi.getPaymentDetails(merchantId)
        ]);
        setMerchant({
          ...merchantData,
          paymentDetails
        });
      } catch (error) {
        console.error('Error fetching merchant data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantData();
  }, [merchantId]);

  const handleOrderCreated = (newOrder) => {
    setMerchant(prev => ({
      ...prev,
      balance: {
        ...prev.balance,
        available: prev.balance.available + (newOrder.type === 'deposit' ? newOrder.amount : -newOrder.amount)
      },
      transactions: [newOrder, ...prev.transactions]
    }));
  };

  if (loading || !merchant) {
    return <Spin size="large" />;
  }

  return (
    <div className="merchant-dashboard">
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Баланс и операции" key="balance">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <BalanceWidget 
                  merchant={merchant} 
                  onOrderCreated={handleOrderCreated}
                />
              </Col>
              <Col xs={24} md={16}>
                <OrderForm 
                  merchant={merchant} 
                  onOrderCreated={handleOrderCreated}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="История транзакций" key="history">
            <TransactionHistory merchantId={merchantId} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default MerchantDashboard;
