import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
      <div className="spinner"></div>
      <span className="spinner-text">Загрузка...</span>
    </div>
  );
};

export default LoadingSpinner;
