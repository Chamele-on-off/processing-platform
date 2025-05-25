import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';

export const TraderLayout = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
