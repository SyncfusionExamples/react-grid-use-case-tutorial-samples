// src/components/TopNav.tsx
import React, { useMemo, useState, useEffect, useRef } from 'react';
import './TopNav.css';
import { AnnouncementPanel, PanelItem } from './Announcement';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns';
import { DataManager, UrlAdaptor, Query, Predicate } from '@syncfusion/ej2-data';
import { useNavigate } from 'react-router-dom';
import { EmployeeDetails } from '../interface';

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

// Employee data source
const employeeDataSource: DataManager = new DataManager({
  url: 'https://ej2services.syncfusion.com/aspnet/development/api/EmployeesData',
  adaptor: new UrlAdaptor(),
  crossDomain: true,
});

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
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<'notifications' | 'announcements'>('announcements');
  const autoCompleteRef = useRef<AutoCompleteComponent>(null);

  const submitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch?.(query.trim());
  };

  // Handle employee selection from AutoComplete
  // Handle employee selection from AutoComplete
const handleEmployeeSelect = (args: any) => {
  if (args.itemData) {
    const employeeData = args.itemData as EmployeeDetails;

    // Logged-in user identity (EMP100001)
    const loggedInUser: Partial<EmployeeDetails> = {
      EmployeeCode: 'EMP100001',
      Name: 'Michael Anderson',
    };

    // Navigate to employee info page.
    // Pass the selected employee as employeeID, and the logged-in user as userInfo
    navigate('/employeeinfo', {
      state: { employeeID: employeeData, userInfo: loggedInUser },
    });

    // Clear UI state
    if (autoCompleteRef.current) {
      autoCompleteRef.current.value = '';
    }
    setQuery('');
    setMobileSearchOpen(false);
  }
};


  // Enable searching by Name, EmployeeCode (ID), or Mail (Email)
  const debounceRef = useRef<number | undefined>(undefined);
  const handleFiltering = (e: any) => {
    const text: string = e.text ?? '';
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      let query = new Query();
      if (text.trim().length > 0) {
        const predicate = new Predicate('Name', 'contains', text, true)
          .or('EmployeeCode', 'contains', text, true)
          .or('Mail', 'contains', text, true);
        query = query.where(predicate).take(20);
      } else {
        query = query.take(20);
      }
      e.updateData(employeeDataSource, query);
    }, 250);
  };

  // Template for displaying employee suggestions
  const itemTemplate = (data: any) => {
    return (
      <a href="#" className="employee-suggestion-link" onClick={(e) => e.preventDefault()}>
        <div className="employee-suggestion-item">
          <div className="employee-avatar-small">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <circle cx="8" cy="6" r="3" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
          </div>
          <div className="employee-info-group">
            <div className="employee-name-link">{data.Name}</div>
            <div className="employee-id-email">{data.EmployeeCode} • {data.Mail}</div>
          </div>
        </div>
      </a>
    );
  };

  const avatarRef = useRef<HTMLDivElement | null>(null);

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
            <div className="search-form" role="search" aria-label="Employee search">
              <div className="search-field-autocomplete">
                <span className="input-icon-autocomplete" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M9.5 3a6.5 6.5 0 0 1 5.19 10.55l5.38 5.38-1.41 1.41-5.38-5.38A6.5 6.5 0 1 1 9.5 3m0 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9Z"
                    />
                  </svg>
                </span>
                <AutoCompleteComponent
                  ref={autoCompleteRef}
                  dataSource={employeeDataSource}
                  fields={{ value: 'Name' }}
                  placeholder="Search by name, ID, or email"
                  popupHeight="300px"
                  filterType="Contains"
                  minLength={2}
                  itemTemplate={itemTemplate}
                  select={handleEmployeeSelect}
                  filtering={handleFiltering}
                  showClearButton={true}
                  cssClass="employee-autocomplete"
                  floatLabelType="Never"
                  suggestionCount={20}
                  ignoreCase={true}
                  onChange={(e: any) => setQuery(e.value || '')}
                />
              </div>
            </div>
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
          <div className="search-form" role="search">
            <div className="search-field-autocomplete-mobile">
              <span className="input-icon-autocomplete-mobile" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M9.5 3a6.5 6.5 0 0 1 5.19 10.55l5.38 5.38-1.41 1.41-5.38-5.38A6.5 6.5 0 1 1 9.5 3m0 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9Z"
                  />
                </svg>
              </span>
              <AutoCompleteComponent
                dataSource={employeeDataSource}
                fields={{ value: 'Name' }}
                placeholder="Search by name, ID, or email"
                popupHeight="300px"
                filterType="Contains"
                minLength={2}
                itemTemplate={itemTemplate}
                select={handleEmployeeSelect}
                filtering={handleFiltering}
                showClearButton={true}
                cssClass="employee-autocomplete-mobile"
                floatLabelType="Never"
                suggestionCount={20}
                ignoreCase={true}
              />
            </div>
          </div>
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