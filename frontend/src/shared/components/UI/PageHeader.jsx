import React from 'react';
import { PageHeader, Breadcrumb, Button, Space } from 'antd';
import { 
  HomeOutlined,
  ReloadOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './PageHeader.css';

const CustomPageHeader = ({ 
  title, 
  subTitle, 
  extra, 
  breadcrumb = true,
  onRefresh,
  onCreate 
}) => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(p => p);

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/"><HomeOutlined /></Link>
    </Breadcrumb.Item>,
    ...paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      return (
        <Breadcrumb.Item key={url}>
          {index === paths.length - 1 ? (
            <span>{path.charAt(0).toUpperCase() + path.slice(1)}</span>
          ) : (
            <Link to={url}>{path.charAt(0).toUpperCase() + path.slice(1)}</Link>
          )}
        </Breadcrumb.Item>
      );
    })
  ];

  const defaultExtra = (
    <Space>
      {onRefresh && (
        <Button 
          icon={<ReloadOutlined />} 
          onClick={onRefresh}
        />
      )}
      {onCreate && (
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onCreate}
        >
          Создать
        </Button>
      )}
    </Space>
  );

  return (
    <div className="page-header-container">
      {breadcrumb && (
        <Breadcrumb className="page-breadcrumb">
          {breadcrumbItems}
        </Breadcrumb>
      )}
      
      <PageHeader
        className="page-header"
        title={title}
        subTitle={subTitle}
        extra={extra || defaultExtra}
      />
    </div>
  );
};

export default CustomPageHeader;
