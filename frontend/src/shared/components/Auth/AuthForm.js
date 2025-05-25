import React from 'react';
import './AuthForms.css';

const AuthForm = ({ title, children, footer }) => {
  return (
    <div className="auth-form">
      {title && <h2 className="auth-form-title">{title}</h2>}
      <div className="auth-form-content">
        {children}
      </div>
      {footer && <div className="auth-form-footer">{footer}</div>}
    </div>
  );
};

export default AuthForm;
