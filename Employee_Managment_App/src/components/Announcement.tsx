// src/components/Announcement.tsx
// Reusable right-side drawer that shows Notifications and Announcements
// Adds Syncfusion Dialog for item details

import React from 'react';
import './Announcement.css';
import { AnnouncementDetailDialog } from './AnnouncementDetailDialog';

export type PanelItem = {
  id: string | number;
  title: string;
  subtitle?: string;
  date?: string;
  type?: 'announcement' | 'notification' | 'message';
  content?: string; // full body to show in dialog
  read?: boolean;   // optional read flag
};

export type AnnouncementPanelProps = {
  open: boolean;
  defaultTab?: 'notifications' | 'announcements';
  notificationItems: PanelItem[];
  announcementItems: PanelItem[];
  topOffset?: number;
  onClose: () => void;
  onChangeTab?: (tab: 'notifications' | 'announcements') => void;
  onMarkAllRead?: (tab: 'notifications' | 'announcements') => void;
  onMarkRead?: (item: PanelItem) => void;
};

export const AnnouncementPanel: React.FC<AnnouncementPanelProps> = ({
  open,
  defaultTab = 'announcements',
  notificationItems,
  announcementItems,
  topOffset = 56,
  onClose,
  onChangeTab,
  onMarkAllRead,
  onMarkRead,
}) => {
  const [tab, setTab] = React.useState<'notifications' | 'announcements'>(defaultTab);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  // dialog state
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<PanelItem | null>(null);

  React.useEffect(() => {
    if (open) setTab(defaultTab);
  }, [open, defaultTab]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  React.useEffect(() => {
    const handleDocClick = (ev: MouseEvent) => {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(ev.target as Node)) onClose();
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, [open, onClose]);

  const setActiveTab = (t: 'notifications' | 'announcements') => {
    setTab(t);
    onChangeTab?.(t);
  };

  const openDetail = (item: PanelItem) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedItem(null);
  };

  const items = tab === 'notifications' ? notificationItems : announcementItems;

  return (
    <>
      <div
        className={`annc-panel-backdrop ${open ? 'open' : ''}`}
        style={{ top: `${topOffset}px` }}
        aria-hidden={!open}
      >
        <aside
          ref={panelRef}
          className={`annc-right-panel ${open ? 'open' : ''}`}
          role="dialog"
          aria-label="Notification panel"
          aria-modal="false"
        >
          <div className="annc-panel-header">
            <div className="annc-panel-title">Notification</div>
            <button className="annc-panel-close" type="button" aria-label="Close" onClick={onClose} title="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          <div className="annc-panel-tabs" role="tablist" aria-label="Notification categories">
            <button role="tab" aria-selected={tab === 'notifications'} className={tab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')} title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </button>
            <button role="tab" aria-selected={tab === 'announcements'} className={tab === 'announcements' ? 'active' : ''} onClick={() => setActiveTab('announcements')} title="Announcements">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3 10v4a1 1 0 0 0 1 1h1l3.89 2.6a2 2 0 0 0 3.11-1.65V7.05A2 2 0 0 0 8.89 5.4L5 8H4a1 1 0 0 0-1 1zm18-4v12l-8-4V10l8-4z" />
              </svg>
            </button>
          </div>

          <div className="annc-panel-subhead">
            {tab === 'notifications' ? <span>Notifications for the last 15 days</span> : <span>Announcements</span>}
            <button className="annc-panel-cta" type="button" onClick={() => onMarkAllRead?.(tab)}>
              Mark all read
            </button>
          </div>

          <div className="annc-panel-content" role="region" aria-live="polite">
            {items.length ? (
              <ul className="annc-panel-list">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className="annc-panel-item"
                    onClick={() => openDetail(it)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openDetail(it)}
                    title="View details"
                  >
                    <span className={`annc-item-icon ${tab === 'announcements' ? 'bullhorn' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d={
                            tab === 'announcements'
                              ? 'M3 10v4a1 1 0 0 0 1 1h1l3.89 2.6a2 2 0 0 0 3.11-1.65V7.05A2 2 0 0 0 8.89 5.4L5 8H4a1 1 0 0 0-1 1zm18-4v12l-8-4V10l8-4z'
                              : 'M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z'
                          }
                        />
                      </svg>
                    </span>
                    <div className="annc-item-body">
                      <div className="annc-item-title">{it.title}</div>
                      {(it.subtitle || it.date) && (
                        <div className="annc-item-meta">
                          {it.subtitle && <span className="meta">{it.subtitle}</span>}
                          {it.date && <span className="meta dot">{it.date}</span>}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="annc-panel-empty">
                {tab === 'notifications' ? 'No notification for the last 15 days.' : 'No announcements for the last 15 days.'}
              </div>
            )}
          </div>
        </aside>
      </div>

      {detailOpen && selectedItem && (
        <AnnouncementDetailDialog
          open={detailOpen}
          item={selectedItem}
          onClose={closeDetail}
          onMarkRead={(it) => onMarkRead?.(it)}
        />
      )}
    </>
  );
};

export default AnnouncementPanel;