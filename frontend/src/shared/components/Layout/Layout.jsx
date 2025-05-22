import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Notification from '../Notifications/Notification';

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      {user && <Sidebar role={user.role} />}
      <div className="main-content">
        {user && <Header />}
        <Notification />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
