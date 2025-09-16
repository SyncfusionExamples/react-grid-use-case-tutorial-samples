// src/components/TopNav.tsx
import React, { useMemo, useState } from 'react';
import './TopNav.css';

type TopNavProps = {
  // Branding
  portalShort?: string;              // e.g., "HR"
  companyName?: string;              // e.g., "NexGen7 Software"

  // Header-to-sidebar alignment
  sidebarWidth?: number;             // expanded width in px (e.g., 240)
  collapsedSidebarWidth?: number;    // collapsed width in px (e.g., 72)
  sidebarCollapsed?: boolean;        // current sidebar state

  // Counters
  notifications?: {
    bell?: number;   // general notifications
    chat?: number;   // messages
    tasks?: number;  // tasks or approvals
  };

  // Handlers
  onToggleSidebar?: () => void;
  onToggleMobileSidebar?: () => void;
  onSearch?: (q: string) => void;
  onCreate?: () => void;
  onOpenNotifications?: () => void;
  onOpenChat?: () => void;
  onOpenTasks?: () => void;
  onOpenApps?: () => void;
  onHelp?: () => void;
  onProfile?: () => void;
  onSignOut?: () => void;

  // User
  userFullName?: string;
};

const TopNav: React.FC<TopNavProps> = ({
  portalShort = 'HR',
  companyName = 'NexGen7 Software',
  sidebarWidth = 240,
  collapsedSidebarWidth = 72,
  sidebarCollapsed = false,

  notifications = { bell: 3, chat: 2, tasks: 1 },

  onToggleSidebar,
  onSearch,
  onCreate,
  onOpenNotifications,
  onOpenChat,
  onOpenTasks,
  onOpenApps,
  onHelp,
  onProfile,
  onSignOut,

  userFullName = 'Test Person',
}) => {
  const [query, setQuery] = useState('');
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const initials = useMemo(() => {
    const parts = userFullName.trim().split(/\s+/);
    const f = parts[0]?.[0] ?? '';
    const l = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (f + l).toUpperCase();
  }, [userFullName]);

  const effectiveSidebar = sidebarCollapsed ? collapsedSidebarWidth : sidebarWidth;

  const submitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <>
      <header
        className="topnav parallel"
        role="banner"
        style={{
          left: `${effectiveSidebar}px`,
          width: `calc(100% - ${effectiveSidebar}px)`,
        }}
      >
        <div className="topnav-inner">
          {/* Left region: brand + hamburger */}
          <div className="cluster-left">
            <div className="brand-line" title={`${portalShort} Portal`}>
              <span className="company-name">{companyName}</span>
            </div>
          </div>

          {/* Center region: search */}
          <div className={`cluster-center ${mobileSearchOpen ? 'hidden-md-up' : ''}`}>
            <form className="search-form" role="search" onSubmit={submitSearch}>
              <div className="search-field">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M9.5 3a6.5 6.5 0 0 1 5.19 10.55l5.38 5.38-1.41 1.41-5.38-5.38A6.5 6.5 0 1 1 9.5 3m0 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9Z"
                  />
                </svg>
                <input
                  type="search"
                  placeholder="Search employees..."
                  aria-label="Search employees"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Right region: actions */}
          <div className="cluster-right">
            {/* Mobile search toggle */}
            <button
              className="icon-btn show-md-down"
              aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              title="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M9.5 3a6.5 6.5 0 0 1 5.19 10.55l5.38 5.38-1.41 1.41-5.38-5.38A6.5 6.5 0 1 1 9.5 3m0 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9Z"
                />
              </svg>
            </button>

            {/* Create button */}
            <button className="btn-create" type="button" onClick={onCreate} title="Create">
              Create
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            {/* Tasks */}
            <button className="icon-btn" type="button" onClick={onOpenTasks} title="Tasks">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                />
              </svg>
              {!!notifications.tasks && <span className="badge">{notifications.tasks}</span>}
            </button>

            {/* Chat */}
            <button className="icon-btn" type="button" onClick={onOpenChat} title="Messages">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M21 6H3v12h5v4l4-4h9z"
                />
              </svg>
              {!!notifications.chat && <span className="badge">{notifications.chat}</span>}
            </button>

            {/* Notifications */}
            <button
              className="icon-btn"
              type="button"
              onClick={onOpenNotifications}
              title="Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z"
                />
              </svg>
              {!!notifications.bell && <span className="badge">{notifications.bell}</span>}
            </button>

            {/* Apps grid */}
            <button className="icon-btn" type="button" onClick={onOpenApps} title="Apps">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"
                />
              </svg>
            </button>

            {/* Help */}
            <button className="icon-btn" type="button" onClick={onHelp} title="Help">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M11 18h2v2h-2zm1-16c-5 0-9 4-9 9s4 9 9 9s9-4 9-9s-4-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7s7 3.14 7 7s-3.14 7-7 7zm-.88-5h1.76v-1c0-1.1 2.12-1.38 2.12-3.25c0-1.65-1.35-2.75-3-2.75c-1.52 0-2.64.83-3.02 2.06l1.64.66c.16-.54.63-1.06 1.38-1.06c.69 0 1.24.42 1.24 1.06c0 1.18-2.12 1.45-2.12 3.28v1z"
                />
              </svg>
            </button>

            {/* Avatar */}
            <div className="avatar-wrapper">
              <button
                className="avatar"
                type="button"
                onClick={() => setAvatarMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={avatarMenuOpen}
                title="Account"
              >
                {initials}
              </button>
              {avatarMenuOpen && (
                <ul className="avatar-menu" role="menu">
                  <li role="menuitem">
                    <button type="button" onClick={onProfile}>My Profile</button>
                  </li>
                  <li role="menuitem">
                    <button type="button" onClick={onSignOut}>Sign out</button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search drawer */}
      {mobileSearchOpen && (
        <div className="mobile-search">
          <form
            className="search-form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch?.(query.trim());
            }}
          >
            <div className="search-field">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M9.5 3a6.5 6.5 0 0 1 5.19 10.55l5.38 5.38-1.41 1.41-5.38-5.38A6.5 6.5 0 1 1 9.5 3m0 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9Z"
                />
              </svg>
              <input
                autoFocus
                type="search"
                placeholder="Search employees..."
                aria-label="Search employees"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn" type="submit">Search</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default TopNav;