// src/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import TopNav from './components/TopNav';
import MyProfile from './components/MyProfile';
import Policies from './components/Policies';
import Achievements from './components/Achievements';
import Organization from './components/Organization';
import EmployeeInfo from './components/EmployeeInfo';
import { PanelItem } from './components/Announcement';

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
  
  // Notification items with read status
  const [notificationItems, setNotificationItems] = useState<PanelItem[]>([
    { id: 1, title: 'Interview for Customer Support Specialist', subtitle: 'Announcement', date: 'Sep 18', type: 'notification', content: 'You are invited for the Customer Support Specialist interview on Sep 22 at 11:00 AM. Please bring your updated resume and ID.', read: false },
    { id: 2, title: 'Interview for Facilities Executive', subtitle: 'Announcement', date: 'Sep 9', type: 'notification', content: 'Facilities Executive interview is scheduled for Sep 23 at 2:30 PM in Meeting Room A.', read: false },
    { id: 3, title: 'Interview for Office Coordinator / Admin', subtitle: 'Announcement', date: 'Sep 5', type: 'notification', content: 'Your interview for the Office Coordinator / Admin position is scheduled on Sep 25 at 10:00 AM in Conference Room B. Please bring your updated resume and a government-issued ID.', read: false },
  ]);

  const [announcementItems, setAnnouncementItems] = useState<PanelItem[]>([
    { id: 'a1', title: 'Policy Update: Remote Work Guidelines', subtitle: 'Corporate Communication', date: 'Sep 16', type: 'announcement', content: 'We have updated our Remote Work Guidelines effective Oct 1. Key changes include flexible core hours and equipment reimbursement policy. Please read the full policy on the intranet.', read: false },
    { id: 'a2', title: 'Holiday: Office Closed on 2nd Oct', subtitle: 'HR', date: 'Sep 14', type: 'announcement', content: 'In observance of a public holiday, all offices will remain closed on 2nd October. Normal operations resume on 3rd October.', read: false },
    { id: 'a3', title: 'Quarterly Town Hall this Friday', subtitle: 'Admin', date: 'Sep 12', type: 'announcement', content: 'Join us for the Quarterly Town Hall on Sep 20 at 4:00 PM in the Main Auditorium. Leadership will share company updates, upcoming initiatives, and answer your questions. Attendance is encouraged.', read: false },
  ]);

  useEffect(() => {
    if (isDesktop) setMobileSidebarOpen(false);
  }, [isDesktop]);

  // Calculate unread counts
  const notifications = useMemo(() => ({
    bell: 3,
    chat: notificationItems.filter(item => !item.read).length,
    tasks: 1,
    announcements: announcementItems.filter(item => !item.read).length,
  }), [notificationItems, announcementItems]);

  // Handler to mark a single item as read
  const handleMarkRead = (itemId: string | number, isNotification: boolean) => {
    if (isNotification) {
      setNotificationItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, read: true } : item
        )
      );
    } else {
      setAnnouncementItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, read: true } : item
        )
      );
    }
  };

  // Handler to mark all as read
  const handleMarkAllRead = (tab: 'notifications' | 'announcements') => {
    if (tab === 'notifications') {
      setNotificationItems((prev) =>
        prev.map((item) => ({ ...item, read: true }))
      );
    } else {
      setAnnouncementItems((prev) =>
        prev.map((item) => ({ ...item, read: true }))
      );
    }
  };

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
          notifications={notifications}
          notificationItems={notificationItems}
          announcementItems={announcementItems}
          onSearch={(q) => console.log('Search:', q)}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onOpenSidebar={() => {
            if (isDesktop) {
              setSidebarCollapsed(false);
            } else {
              setMobileSidebarOpen(true);
            }
          }}
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
          className='app-nav-sidebar'
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
                className="sidebar-toggle e-icons e-menu"
                aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
                title={collapsed ? 'Expand' : 'Collapse'}
                onClick={isDesktop ? toggleDesktopSidebar : toggleMobileSidebar}
              >
              </button>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end title={collapsed ? 'My Profile' : undefined} aria-label="My Profile">
                  <span className="nav-icon e-icons e-user" aria-hidden="true">
                  </span>
                  {!collapsed && <span className="nav-text">My Profile</span>}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/organization" title={collapsed ? 'Organization' : undefined} aria-label="Organization">
                  <span className="nav-icon e-icons e-xml-mapping" aria-hidden="true">
                  </span>
                  {!collapsed && <span className="nav-text">Organization</span>}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/policies" title={collapsed ? 'Policies' : undefined} aria-label="Policies">
                  <span className="nav-icon e-icons e-file-format" aria-hidden="true">
                  </span>
                  {!collapsed && <span className="nav-text">Policies</span>}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/achievements" title={collapsed ? 'Achievements' : undefined} aria-label="Achievements">
                  <span className="nav-icon e-icons e-activities" aria-hidden="true">
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