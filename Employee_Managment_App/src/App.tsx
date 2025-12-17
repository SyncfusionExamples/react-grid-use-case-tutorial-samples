// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import TopNav from './components/TopNav';
import MyProfile from './components/MyProfile';
import Policies from './components/Policies';
import Achievements from './components/Achievements';
import Organization from './components/Organization';
import EmployeeInfo from './components/EmployeeInfo';

// Syncfusion Sidebar
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';

type LayoutCSSVars = React.CSSProperties & {
  ['--sidebar-expanded']?: string;
  ['--sidebar-collapsed']?: string;
  ['--header-h']?: string;
  ['--sidebar-current-width']?: string;
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener?.('change', onChange);
    mq.addListener?.(onChange);
    return () => {
      mq.removeEventListener?.('change', onChange);
      mq.removeListener?.(onChange);
    };
  }, [query]);
  return matches;
}

function App() {
  const SIDEBAR_WIDTH = 240;
  const SIDEBAR_WIDTH_COLLAPSED = 72;
  const HEADER_HEIGHT = 56;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop dock
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // mobile overlay
  const isDesktop = useMediaQuery('(min-width: 992px)');

  useEffect(() => {
    if (isDesktop) setMobileSidebarOpen(false);
  }, [isDesktop]);

  const layoutVars: LayoutCSSVars = {
    '--sidebar-expanded': `${SIDEBAR_WIDTH}px`,
    '--sidebar-collapsed': `${SIDEBAR_WIDTH_COLLAPSED}px`,
    '--header-h': `${HEADER_HEIGHT}px`,
    '--sidebar-current-width': isDesktop
      ? sidebarCollapsed
        ? `${SIDEBAR_WIDTH_COLLAPSED}px`
        : `${SIDEBAR_WIDTH}px`
      : '0px',
  };

  const toggleDesktopSidebar = () => setSidebarCollapsed((v) => !v);
  const toggleMobileSidebar = () => setMobileSidebarOpen((v) => !v);

  const sbIsOpen = isDesktop ? !sidebarCollapsed : mobileSidebarOpen;
  const sbEnableDock = isDesktop;
  const sbType = isDesktop ? 'Push' : 'Over';

  const collapsed = isDesktop && sidebarCollapsed;

  return (
    <div
      className={`app-layout ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''} ${
        mobileSidebarOpen ? 'mobile-sidebar-is-open' : ''
      }`}
      style={layoutVars}
    >
      <Router>
        <TopNav
          companyName="NexGen7 Software"
          userFullName="Test Person"
          headerOffsetLeft={isDesktop ? (sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH) : 0}
          onSearch={(q) => console.log('Search:', q)}
        />

        {/* Syncfusion Sidebar */}
        <SidebarComponent
          width={`${SIDEBAR_WIDTH}px`}
          dockSize={`${SIDEBAR_WIDTH_COLLAPSED}px`}
          enableDock={sbEnableDock}
          enableGestures={false}
          isOpen={sbIsOpen}
          type={sbType as any}
          position="Left"
          showBackdrop={!isDesktop}
          closeOnDocumentClick={!isDesktop}
          open={() => {
            if (!isDesktop) setMobileSidebarOpen(true);
          }}
          close={() => {
            if (!isDesktop) setMobileSidebarOpen(false);
          }}
        >
          <aside className="app-sidebar" role="navigation" aria-label="Main">
            {/* Sidebar header with toggle inside sidebar */}
            <div className="sidebar-brand">
              <div className="title">{collapsed ? 'HR' : 'HR Portal'}</div>
              <button
                type="button"
                className="sidebar-toggle"
                aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
                title={collapsed ? 'Expand' : 'Collapse'}
                onClick={isDesktop ? toggleDesktopSidebar : toggleMobileSidebar}
              >
                {/* menu icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
                </svg>
              </button>
            </div>

            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  <span className="nav-icon" aria-hidden="true">
                    {/* user/profile */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                    </svg>
                  </span>
                  {!collapsed && <span className="nav-text">My Profile</span>}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/organization">
                  <span className="nav-icon" aria-hidden="true">
                    {/* organization/people */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M16 11a4 4 0 1 0-3.465-2H11V7H8V5H4v2H1v3h3v2h3v2h3v2h3.535A4 4 0 1 0 16 11zM6 7h2v2H6zm10-2a2 2 0 1 1 0 4a2 2 0 0 1 0-4zm0 10a2 2 0 1 1 0 4a2 2 0 0 1 0-4z" />
                    </svg>
                  </span>
                  {!collapsed && <span className="nav-text">Organization</span>}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/policies">
                  <span className="nav-icon" aria-hidden="true">
                    {/* policy/document */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M6 2h9l5 5v15H6zM8 4v16h10V9h-5V4zm2 7h6v2h-6zm0 4h6v2h-6z" />
                    </svg>
                  </span>
                  {!collapsed && <span className="nav-text">Policies</span>}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/achievements">
                  <span className="nav-icon" aria-hidden="true">
                    {/* trophy */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M17 3H7v4a5 5 0 0 0 4 4.9V14H8v2h8v-2h-3v-2.1A5 5 0 0 0 17 7zM7 7V5h10v2a3 3 0 0 1-6 0H9a3 3 0 0 1-2 3z" />
                    </svg>
                  </span>
                  {!collapsed && <span className="nav-text">Achievements</span>}
                </NavLink>
              </li>
            </ul>
          </aside>
        </SidebarComponent>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<MyProfile />} />
            <Route path="/organization" element={<Organization />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/employeeinfo" element={<EmployeeInfo />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;