// src/components/TopNav.tsx
import React, { useMemo, useState, useEffect, useRef } from 'react';
import './TopNav.css';
import { AnnouncementPanel, PanelItem } from './Announcement';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

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
  onProfile?: () => void;
  onSignOut?: () => void;
  userFullName?: string;
  onMarkRead?: (itemId: string | number, isNotification: boolean) => void;
  onMarkAllRead?: (tab: 'notifications' | 'announcements') => void;
  onOpenSidebar?: () => void;
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
  onProfile,
  onSignOut,
  userFullName = 'Test Person',
  onMarkRead,
  onMarkAllRead,
  onOpenSidebar,
}) => {
  const [query, setQuery] = useState('');
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<'notifications' | 'announcements'>('announcements');

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
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAvatarMenuOpen(false);
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

  const TOPNAV_HEIGHT = 56;

  const notificationItemsWithIcon = useMemo<PanelItem[]>(
    () =>
      (notificationItems || []).map((it) => ({
        ...it,
        iconClass: 'e-icons e-multiple-comment',
      })),
    [notificationItems]
  );

  const announcementItemsWithIcon = useMemo<PanelItem[]>(
    () =>
      (announcementItems || []).map((it) => ({
        ...it,
        iconClass: 'e-icons e-audio',
      })),
    [announcementItems]
  );

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
            <ButtonComponent
              cssClass="icon-btn show-md-down topnav-menu-btn"
              aria-label="Open sidebar"
              title="Menu"
              type="button"
              onClick={onOpenSidebar}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
              </svg>
            </ButtonComponent>
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
                <ButtonComponent
                  type="button"
                  cssClass="clear-btn"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  title="Clear"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                    <path fill="currentColor" d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.29-6.3z" />
                  </svg>
                </ButtonComponent>
              </div>
            </form>
          </div>

          <div className="cluster-right">
            <ButtonComponent
              cssClass="icon-btn show-md-down"
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
            </ButtonComponent>

            <button className="icon-btn e-icons e-multiple-comment" type="button" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPanelTab('notifications');
                setPanelOpen(true);
                onOpenNotifications?.();
              }} title="Messages">
              {!!notifications.chat && <span className="badge">{notifications.chat}</span>}
            </button>

            <button
              className="icon-btn e-icons e-audio"
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
              {!!notifications.announcements && (
                <span className="badge">{notifications.announcements}</span>
              )}
            </button>

            <div className="topnav-avatar-wrapper" ref={avatarRef}>
              <ButtonComponent
                cssClass="topnav-avatar"
                iconCss="e-icons e-user"
                type="button"
                aria-haspopup="menu"
                aria-expanded={avatarMenuOpen}
                title="Account"
                onClick={() => setAvatarMenuOpen((o) => !o)}
              />
              <div>
                <span className="topnav-avatar-name">Hi, Michael Anderson</span>
              </div>
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
        notificationItems={notificationItemsWithIcon}
        announcementItems={announcementItemsWithIcon}
        topOffset={TOPNAV_HEIGHT}
        onClose={() => setPanelOpen(false)}
        onChangeTab={(t) => setPanelTab(t)}
        onMarkAllRead={onMarkAllRead}
        onMarkRead={onMarkRead}
      />
    </>
  );
};

export default TopNav;