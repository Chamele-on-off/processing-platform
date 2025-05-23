import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = ({ collapsed = false }) => {
  return (
    <Link to="/" className="app-logo">
      {collapsed ? (
        <div className="logo-collapsed">
          <span>PP</span>
        </div>
      ) : (
        <div className="logo-full">
          <span className="logo-text">Processing Platform</span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
