// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import TopNav from './components/TopNav';
import MyProfile from './components/MyProfile';
import Policies from './components/Policies';
import Achievements from './components/Achievements';
import Announcement from './components/Announcement';
import Organization from './components/Organization';
import EmployeeInfo from './components/EmployeeInfo';

// Extend CSSProperties so TS accepts our custom CSS variables
type LayoutCSSVars = React.CSSProperties & {
  ['--sidebar-expanded']?: string;
  ['--sidebar-collapsed']?: string;
  ['--header-h']?: string;
  ['--sidebar-current-width']?: string;
};

function App() {
  // Layout constants
  const SIDEBAR_WIDTH = 240;
  const SIDEBAR_WIDTH_COLLAPSED = 72;
  const HEADER_HEIGHT = 56;

  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // CSS vars consumed by App.css
  const layoutVars: LayoutCSSVars = {
    '--sidebar-expanded': `${SIDEBAR_WIDTH}px`,
    '--sidebar-collapsed': `${SIDEBAR_WIDTH_COLLAPSED}px`,
    '--header-h': `${HEADER_HEIGHT}px`,
    '--sidebar-current-width': sidebarCollapsed
      ? `${SIDEBAR_WIDTH_COLLAPSED}px`
      : `${SIDEBAR_WIDTH}px`,
  };

  const toggleDesktopSidebar = () => setSidebarCollapsed((v) => !v);
  const toggleMobileSidebar = () => setMobileSidebarOpen((v) => !v);

  return (
    <div
      className={`app-layout ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''} ${
        mobileSidebarOpen ? 'mobile-sidebar-is-open' : ''
      }`}
      style={layoutVars}
    >
      <Router>
        <TopNav
          companyName="Syncfusion Software"
          userFullName="Test Person"
          sidebarWidth={SIDEBAR_WIDTH}
          collapsedSidebarWidth={SIDEBAR_WIDTH_COLLAPSED}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleDesktopSidebar}
          onSearch={(q) => console.log('Search:', q)}
        />

        {/* Sidebar */}
        <aside className="app-sidebar" role="navigation" aria-label="Main">
          <div className="sidebar-brand">
            <div className="title">HR Portal</div>
            <span className="e-icons e-line-very-small"></span>
          </div>

          <ul className="nav flex-column">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>My Profile</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/organization">Organization</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/policies">Policies</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/achievements">Achievements</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/announcement">Announcement</NavLink>
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<MyProfile />} />
            <Route path="/organization" element={<Organization />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/employeeinfo" element={<EmployeeInfo />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;