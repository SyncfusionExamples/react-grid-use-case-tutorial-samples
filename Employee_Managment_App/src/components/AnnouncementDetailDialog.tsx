// src/components/AnnouncementDetailDialog.tsx
// Removed "Title" and "Reference ID" from the details grid (annc-dlg-card).
// Header still shows the main title. Rest of the layout and styles remain unchanged.

import React from 'react';
import { DialogComponent, AnimationSettingsModel } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import './AnnouncementDialog.css';

export type DetailItem = {
  id: string | number;
  title: string;
  subtitle?: string;
  date?: string;
  type?: 'announcement' | 'notification' | 'message';
  content?: string;
  read?: boolean;
};

export type AnnouncementDetailDialogProps = {
  open: boolean;
  item: DetailItem;
  onClose: () => void;
  onMarkRead?: (itemId: string | number, isNotification: boolean) => void;
};

const dialogAnimation: AnimationSettingsModel = { effect: 'Zoom', duration: 140 };

const BullhornIcon = () => (
  <div className="e-icons e-audio"></div>
);
const BellIcon = () => (
  <div className='e-icons e-multiple-comment'></div>
);
const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M20 2H4a2 2 0 0 0-2 2v16l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
  </svg>
);

const getMeta = (type?: DetailItem['type']) => {
  switch (type) {
    case 'notification':
      return { label: 'Notification', Icon: BellIcon };
    case 'message':
      return { label: 'Message', Icon: MessageIcon };
    default:
      return { label: 'Announcement', Icon: BullhornIcon };
  }
};

export const AnnouncementDetailDialog: React.FC<AnnouncementDetailDialogProps> = ({
  open,
  item,
  onClose,
  onMarkRead,
}) => {
  const { label, Icon } = getMeta(item?.type);
  // Use dialog ref to trigger built-in hide animation for custom buttons
  const dialogRef = React.useRef<DialogComponent | null>(null);
  const hideWithAnimation = () => {
    dialogRef.current?.hide();
  };

  const headerTemplate = () => (
    <div className="annc-dlg-header" role="group" aria-label="Announcement header">
      <span className={`annc-dlg-icon ${item?.type || 'announcement'}`} aria-hidden="true">
        <Icon />
      </span>
      <div className="annc-dlg-headings">
        <div className="annc-dlg-title" title={item?.title}>
          {item?.title || 'Details'}
        </div>
      </div>
    </div>
  );

  // Details to show inside the card (Title and Reference ID removed)
  const detailsRows: { key: string; label: string; value?: React.ReactNode }[] = [
    { key: 'subtitle', label: 'Subtitle', value: item?.subtitle || '-' },
    {
      key: 'type',
      label: 'Type',
      value: <span className={`type-badge ${item?.type || 'announcement'}`}>{label}</span>,
    },
    { key: 'date', label: 'Date', value: item?.date || '-' },
    {
      key: 'status',
      label: 'Status',
      value: (
        <span className={`status-badge ${item?.read ? 'read' : 'unread'}`}>
          {item?.read ? 'Read' : 'Unread'}
        </span>
      ),
    },
  ];

  const footerTemplate = () => (
    <div className="annc-dlg-footer">
      {item && !item.read && (
        <ButtonComponent cssClass="e-primary" onClick={() => {
          const isNotification = item.type === 'notification';
          onMarkRead?.(item.id, isNotification);
          // trigger dialog close with animation; onClose will be fired on close event
          hideWithAnimation();
        }}>
          Mark as read
        </ButtonComponent>
      )}
      <ButtonComponent onClick={hideWithAnimation}>Close</ButtonComponent>
    </div>
  );

  return (
    <DialogComponent
      ref={dialogRef}
      isModal
      visible={open}
      showCloseIcon
      closeOnEscape
      width="min(92vw, 720px)"
      height="auto"
      cssClass="e-annc-detail-dialog no-gradient"
      animationSettings={dialogAnimation}
      header={headerTemplate}
      footerTemplate={footerTemplate}
      target="body"
      overlayClick={hideWithAnimation}
      close={onClose}
    >
      <div className="annc-dlg-content">
        <section className="annc-dlg-card" aria-label="Announcement details">
          <div className="annc-dlg-details">
            {detailsRows.map((row) => (
              <div className="annc-dlg-details_item" key={row.key}>
                <div className="annc-dlg-details_label">{row.label}</div>
                <div className="annc-dlg-details_value">{row.value ?? '-'}</div>
              </div>
            ))}
          </div>
        </section>

        {item?.content && (
          <section className="annc-dlg-section" aria-label="Description">
            <div className="annc-dlg-section_title">Description</div>
            <p className="annc-dlg-paragraph">{item.content}</p>
          </section>
        )}
      </div>
    </DialogComponent>
  );
};