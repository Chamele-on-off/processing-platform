import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import ReportGenerator from '../../components/Reports/ReportGenerator';
import ReportTemplates from '../../components/Reports/ReportTemplates';
import ReportHistory from '../../components/Reports/ReportHistory';
import PageHeader from '../../../shared/components/UI/PageHeader';

const { TabPane } = Tabs;

const Reporting = () => {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="reporting-page">
      <PageHeader 
        title="Отчетность" 
        breadcrumb={[
          { title: 'Главная', link: '/admin/dashboard' },
          { title: 'Отчеты' }
        ]}
      />
      
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Генератор отчетов" key="generator">
            <ReportGenerator />
          </TabPane>
          <TabPane tab="Шаблоны отчетов" key="templates">
            <ReportTemplates />
          </TabPane>
          <TabPane tab="История отчетов" key="history">
            <ReportHistory />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Reporting;
