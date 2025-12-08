// src/components/TopNav.tsx
import React, { useMemo, useState, useEffect, useRef } from 'react';
import './TopNav.css';
import { AnnouncementPanel, PanelItem } from './Announcement';

type TopNavProps = {
  portalShort?: string;
  companyName?: string;
  headerOffsetLeft?: number;
  notifications?: {
    bell?: number;
    chat?: number;
    tasks?: number;
    announcements?: number;
  };
  notificationItems?: PanelItem[];
  announcementItems?: PanelItem[];
  onSearch?: (q: string) => void;
  onCreate?: () => void;
  onOpenNotifications?: () => void;
  onOpenChat?: () => void;
  onOpenTasks?: () => void;
  onOpenApps?: () => void;
  onOpenAnnouncements?: () => void;
  onHelp?: () => void;
  onProfile?: () => void;
  onSignOut?: () => void;
  userFullName?: string;
};

const TopNav: React.FC<TopNavProps> = ({
  portalShort = 'HR',
  companyName = 'NexGen7 Software',
  headerOffsetLeft = 0,
  notifications = { bell: 3, chat: 2, tasks: 1, announcements: 3 },
  notificationItems = [
    { id: 1, title: 'Interview for Customer Support Specialist', subtitle: 'Announcement', date: 'Sep 18', type: 'notification', content: 'You are invited for the Customer Support Specialist interview on Sep 22 at 11:00 AM. Please bring your updated resume and ID.' },
    { id: 2, title: 'Interview for Facilities Executive', subtitle: 'Announcement', date: 'Sep 9', type: 'notification', content: 'Facilities Executive interview is scheduled for Sep 23 at 2:30 PM in Meeting Room A.' },
    { id: 3, title: 'Interview for Office Coordinator / Admin', subtitle: 'Announcement', date: 'Sep 5', type: 'notification', content: 'Your interview for the Office Coordinator / Admin position is scheduled on Sep 25 at 10:00 AM in Conference Room B. Please bring your updated resume and a government-issued ID.' },
  ],
  announcementItems = [
    { id: 'a1', title: 'Policy Update: Remote Work Guidelines', subtitle: 'Corporate Communication', date: 'Sep 16', type: 'announcement', content: 'We have updated our Remote Work Guidelines effective Oct 1. Key changes include flexible core hours and equipment reimbursement policy. Please read the full policy on the intranet.' },
    { id: 'a2', title: 'Holiday: Office Closed on 2nd Oct', subtitle: 'HR', date: 'Sep 14', type: 'announcement', content: 'In observance of a public holiday, all offices will remain closed on 2nd October. Normal operations resume on 3rd October.' },
    { id: 'a3', title: 'Quarterly Town Hall this Friday', subtitle: 'Admin', date: 'Sep 12', type: 'announcement', content: 'Join us for the Quarterly Town Hall on Sep 20 at 4:00 PM in the Main Auditorium. Leadership will share company updates, upcoming initiatives, and answer your questions. Attendance is encouraged.' },
  ],
  onSearch,
  onCreate,
  onOpenNotifications,
  onOpenChat,
  onOpenTasks,
  onOpenApps,
  onOpenAnnouncements,
  onHelp,
  onProfile,
  onSignOut,
  userFullName = 'Test Person',
}) => {
  const [query, setQuery] = useState('');
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<'notifications' | 'announcements'>('announcements');

  const initials = useMemo(() => {
    const parts = userFullName.trim().split(/\s+/);
    const f = parts[0]?.[0] ?? '';
    const l = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (f + l).toUpperCase();
  }, [userFullName]);

  const submitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch?.(query.trim());
  };

  const avatarRef = useRef<HTMLDivElement | null>(null);
  const createRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleDocClick = (ev: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(ev.target as Node)) {
        setAvatarMenuOpen(false);
      }
      if (createRef.current && !createRef.current.contains(ev.target as Node)) {
        setCreateMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAvatarMenuOpen(false);
        setCreateMenuOpen(false);
        setMobileSearchOpen(false);
        setPanelOpen(false);
      }
    };
    document.addEventListener('click', handleDocClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleDocClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const openAnnouncementsPanel = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setPanelTab('announcements');
    setPanelOpen(true);
    onOpenAnnouncements?.();
  };

  const TOPNAV_HEIGHT = 56;

  return (
    <>
      <header
        className="topnav parallel"
        role="banner"
        style={{
          left: `${headerOffsetLeft}px`,
          width: `calc(100% - ${headerOffsetLeft}px)`,
        }}
      >
        <div className="topnav-inner">
          <div className="cluster-left">
            <div className="brand-line" title={`${portalShort} Portal`}>
              <span className="company-name">{companyName}</span>
            </div>
          </div>

          <div className={`cluster-center ${mobileSearchOpen ? 'is-open' : ''}`}>
            <form className="search-form" role="search" aria-label="Employee search" onSubmit={submitSearch}>
              <div className={`search-field input-group ${query ? 'has-value' : ''}`}>
                <span className="input-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M9.5 3a6.5 6.5 0 0 1 5.19 10.55l5.38 5.38-1.41 1.41-5.38-5.38A6.5 6.5 0 1 1 9.5 3m0 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9Z"
                    />
                  </svg>
                </span>
                <input
                  className="form-control search-input"
                  type="search"
                  name="q"
                  placeholder="Search Employee"
                  aria-label="Search Employee"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape' && query) {
                      e.preventDefault();
                      setQuery('');
                    }
                  }}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  title="Clear"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                    <path fill="currentColor" d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.29-6.3z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div className="cluster-right">
            <button className="icon-btn show-md-down"
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

            <div className="btn-create-group" ref={createRef}>
              <button
                className="btn-create"
                type="button"
                onClick={() => setCreateMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={createMenuOpen}
                title="Create"
              >
                <span>Create</span>
                <span className="e-icons e-chevron-down-fill" aria-hidden="true"></span>
              </button>

              {createMenuOpen && (
                <ul className="create-menu" role="menu">
                  <li role="menuitem">
                    <button type="button" onClick={onCreate}>Create Leave</button>
                  </li>
                  <li role="menuitem">
                    <button type="button" onClick={onCreate}>Create Permission</button>
                  </li>
                </ul>
              )}
            </div>

            <button className="icon-btn" type="button" onClick={onOpenChat} title="Messages">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M21 6H3v12h5v4l4-4h9z" />
              </svg>
              {!!notifications.chat && <span className="badge">{notifications.chat}</span>}
            </button>

            <button
              className="icon-btn"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPanelTab('announcements');
                setPanelOpen(true);
                onOpenAnnouncements?.();
              }}
              title="Announcements"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M3 10v4a1 1 0 0 0 1 1h1l3.89 2.6a2 2 0 0 0 3.11-1.65V7.05A2 2 0 0 0 8.89 5.4L5 8H4a1 1 0 0 0-1 1zm18-4v12l-8-4V10l8-4z"
                />
              </svg>
              {!!notifications.announcements && (
                <span className="badge">{notifications.announcements}</span>
              )}
            </button>

            <button className="icon-btn" type="button" onClick={onHelp} title="Help">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M11 18h2v2h-2zm1-16c-5 0-9 4-9 9s4 9 9 9s9-4 9-9s-4-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7s7 3.14 7 7s-3.14 7-7 7zm-.88-5h1.76v-1c0-1.1 2.12-1.38 2.12-3.25c0-1.65-1.35-2.75-3-2.75c-1.52 0-2.64.83-3.02 2.06l1.64.66c.16-.54.63-1.06 1.38-1.06c.69 0 1.24.42 1.24 1.06c0 1.18-2.12 1.45-2.12 3.28v1z"
                />
              </svg>
            </button>

            <div className="topnav-avatar-wrapper" ref={avatarRef}>
              <button
                className="topnav-avatar"
                type="button"
                onClick={() => setAvatarMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={avatarMenuOpen}
                title="Account"
              >
                {initials}
              </button>
              {avatarMenuOpen && (
                <ul className="topnav-avatar-menu" role="menu">
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
            <div className="search-field search-bootstrap input-group">
              <span className="input-group-text" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M9.5 3a6.5 6.5 0 0 1 5.19 10.55l5.38 5.38-1.41 1.41-5.38-5.38A6.5 6.5 0 1 1 9.5 3m0 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9Z"
                  />
                </svg>
              </span>
              <input
                className="form-control"
                autoFocus
                type="search"
                placeholder="Search Employee"
                aria-label="Search Employee"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      )}

      <AnnouncementPanel
        open={panelOpen}
        defaultTab={panelTab}
        notificationItems={notificationItems}
        announcementItems={announcementItems}
        topOffset={TOPNAV_HEIGHT}
        onClose={() => setPanelOpen(false)}
        onChangeTab={(t) => setPanelTab(t)}
      />
    </>
  );
};

export default TopNav;