import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  CreditCard,
  PiggyBank,
  Calendar,
  Menu,
  X,
  Home,
  Brain
} from 'lucide-react';

interface SidebarProps {
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const sidebarClass = isMobile
    ? `sidebar ${mobileOpen ? 'show' : ''}`
    : `sidebar ${collapsed ? 'sidebar-collapsed' : ''}`;

  const navItems = [
    {
      path: '/',
      icon: <Home size={20} />,
      name: 'Dashboard'
    },
    {
      path: '/expenses',
      icon: <CreditCard size={20} />,
      name: 'Expenses'
    },
    {
      path: '/savings',
      icon: <PiggyBank size={20} />,
      name: 'Savings Goals'
    },
    {
      path: '/subscriptions',
      icon: <Calendar size={20} />,
      name: 'Subscriptions'
    },
    {
      path: '/reports',
      icon: <BarChart3 size={20} />,
      name: 'Reports'
    },
    {
      path: '/ai-insights',
      icon: <Brain size={20} />,
      name: 'AI Insights'
    }
  ];

  return (
    <>
      {isMobile && (
        <div className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom">
          <h4 className="m-0">SpendSmart</h4>
          <button
            className="btn btn-light"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>
        </div>
      )}

      <div className={sidebarClass}>
        <div className="d-flex justify-content-between align-items-center p-3">
          {!collapsed && !isMobile && <h4 className="m-0">SpendSmart</h4>}
          <button
            className="btn btn-light"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed || isMobile ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <div className="mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-text">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {isMobile && mobileOpen && (
        <div
          className="position-fixed top-0 bottom-0 left-0 right-0 bg-dark opacity-50"
          style={{ zIndex: 999 }}
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;