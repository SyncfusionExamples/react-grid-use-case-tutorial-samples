// src/pages/AnnouncementsPage.tsx
import React from 'react';
import AnnouncementPanel, { PanelItem } from '../components/Announcement';

const notifications: PanelItem[] = [
  { id: 1, title: 'Interview for Customer Support Specialist', subtitle: 'Announcement', date: 'Sep 18', type: 'notification', content: 'You are invited for the Customer Support Specialist interview on Sep 22 at 11:00 AM. Please bring your updated resume and ID.' },
  { id: 2, title: 'Interview for Facilities Executive', subtitle: 'Announcement', date: 'Sep 9', type: 'notification', content: 'Facilities Executive interview is scheduled for Sep 23 at 2:30 PM in Meeting Room A.' },
];

const announcements: PanelItem[] = [
  { id: 11, title: 'Policy Update: Remote Work Guidelines', subtitle: 'Corporate Communication', date: 'Sep 16', type: 'announcement', content: 'We have updated our Remote Work Guidelines effective Oct 1. Key changes include flexible core hours and equipment reimbursement policy. Please read the full policy on the intranet.' },
  { id: 12, title: 'Holiday: Office Closed on 2nd Oct', subtitle: 'HR', date: 'Sep 14', type: 'announcement', content: 'In observance of a public holiday, all offices will remain closed on 2nd October. Normal operations resume on 3rd October.' },
];

export default function AnnouncementsPage() {
  const [open, setOpen] = React.useState(true);

  return (
    <AnnouncementPanel
      open={open}
      defaultTab="announcements"
      notificationItems={notifications}
      announcementItems={announcements}
      onClose={() => setOpen(false)}
      onMarkRead={(item) => console.log('Marked as read:', item.id)}
      onMarkAllRead={(tab) => console.log('Mark all read clicked for:', tab)}
    />
  );
}