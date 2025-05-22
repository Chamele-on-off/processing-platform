import React from 'react';
import { Breadcrumb, PageHeader as AntPageHeader } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const PageHeader = ({ title, breadcrumb, extra }) => {
  return (
    <div className="page-header">
      <AntPageHeader
        title={title}
        breadcrumb={
          <Breadcrumb>
            {breadcrumb.map((item, index) => (
              <Breadcrumb.Item key={index} href={item.link}>
                {index === 0 ? <HomeOutlined /> : null}
                {item.title}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        }
        extra={extra}
      />
    </div>
  );
};

export default PageHeader;
