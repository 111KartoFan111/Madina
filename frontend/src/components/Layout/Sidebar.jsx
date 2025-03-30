import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <i className="icon dashboard-icon"></i>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/food-tracker" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <i className="icon food-icon"></i>
              <span>Food Tracker</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/meal-planner" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <i className="icon meal-icon"></i>
              <span>Meal Planner</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/profile" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <i className="icon profile-icon"></i>
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;