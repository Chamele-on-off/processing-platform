import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => (
  <nav className="app-sidebar">
    <NavLink to="/dashboard">Dashboard</NavLink>
    <NavLink to="/trades">Trades</NavLink>
    <NavLink to="/settings">Settings</NavLink>
  </nav>
);
