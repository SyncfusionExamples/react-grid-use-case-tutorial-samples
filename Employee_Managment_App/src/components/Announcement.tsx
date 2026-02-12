// src/components/Announcement.tsx
// Reusable right-side drawer that shows Notifications and Announcements
// Adds Syncfusion Dialog for item details
import React from 'react';
import './Announcement.css';
import { AnnouncementDetailDialog } from './AnnouncementDetailDialog';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

export type PanelItem = {
  id: string | number;
  title: string;
  subtitle?: string;
  date?: string;
  type?: 'announcement' | 'notification' | 'message';
  content?: string; // full body to show in dialog
  read?: boolean;   // optional read flag
  iconClass?: string;
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
  onMarkRead?: (itemId: string | number, isNotification: boolean) => void;
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  React.useEffect(() => {
    const handleDocClick = (ev: MouseEvent) => {
      if (!open) return;

      const target = ev.target as Node;

      // If detail dialog is open, ignore clicks inside dialog or its overlay
      if (detailOpen) {
        const dialogEl = document.querySelector('.e-annc-detail-dialog') as HTMLElement | null;
        const overlayEl = document.querySelector('.e-dlg-overlay') as HTMLElement | null;

        const clickedInsideDialog =
          (dialogEl && dialogEl.contains(target)) ||
          (overlayEl && overlayEl.contains(target));

        if (clickedInsideDialog) {
          // Let the dialog handle its own close via overlayClick; don't close the aside
          return;
        }
      }

      // Close aside only when clicking outside both the aside and (if open) the dialog
      if (panelRef.current && !panelRef.current.contains(target)) {
        onClose();
      }
    };

    // Use capture to catch the click before Syncfusion might stop propagation
    document.addEventListener('click', handleDocClick, true);
    return () => document.removeEventListener('click', handleDocClick, true);
  }, [open, onClose, detailOpen]);

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

  const handleMarkAllRead = () => {
    // Notify parent to update notification counts
    onMarkAllRead?.(tab);
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
            <ButtonComponent
              className="annc-panel-close e-flat e-btn"
              cssClass="annc-panel-close"
              type="button"
              iconCss='e-icons e-close'
              aria-label="Close"
              onClick={onClose}
              title="Close"
            >
            </ButtonComponent>
          </div>

          <div className="annc-panel-tabs" role="tablist" aria-label="Notification categories">
            <button role="tab" aria-selected={tab === 'notifications'} className={tab === 'notifications' ? 'active side-icon e-icons e-multiple-comment' : 'e-icons e-multiple-comment'} onClick={() => setActiveTab('notifications')} title="Notifications">
            </button>
            <button role="tab" aria-selected={tab === 'announcements'} className={tab === 'announcements' ? 'active side-icon e-icons e-audio' : 'e-icons e-audio'} onClick={() => setActiveTab('announcements')} title="Announcements">
            </button>
          </div>

          <div className="annc-panel-subhead">
            {tab === 'notifications' ? (
              <span>Notifications for the last 15 days</span>
            ) : (
              <span>Notifications for the last 15 days</span>
            )}
            <ButtonComponent
              cssClass="annc-panel-cta"
              className='e-btn e-flat'
              type="button"
              disabled={!items.some((it) => !it.read)}
              onClick={handleMarkAllRead}
            >
              Mark all read
            </ButtonComponent>
          </div>

          <div className="annc-panel-content" role="region" aria-live="polite">
            {items.length ? (
              <ul className="annc-panel-list">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className={`annc-panel-item ${it.read ? 'is-read' : 'is-unread'}`}
                    onClick={() => openDetail(it)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openDetail(it)}
                    title={`${it.read ? 'Read' : 'Unread'} - ${it.title}`}
                  >
                    <span className="panel-item-icon" aria-hidden="true">
                      <i className={it.iconClass ?? (it.type === 'announcement' ? 'e-icons e-audio' : 'e-icons e-multiple-comment')} />
                    </span>
                    <div className="annc-item-body">
                      <div className={`annc-item-title ${!it.read ? 'unread' : ''}`}>{it.title}</div>
                      {(it.subtitle || it.date) && (
                        <div className="annc-item-meta">
                          {it.subtitle && <span className="meta-unread meta">{it.subtitle}</span>}
                          {it.date && <span className="meta dot">{it.date}</span>}
                        </div>
                      )}
                    </div>
                    {!it.read && <span className="unread-indicator" aria-label="Unread"></span>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="annc-panel-empty">
                {tab === 'notifications'
                  ? 'No notification for the last 15 days.'
                  : 'No announcements for the last 15 days.'}
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
          onMarkRead={onMarkRead}
        />
      )}
    </>
  );
};

export default AnnouncementPanel;