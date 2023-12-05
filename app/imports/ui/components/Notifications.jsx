import React, { useEffect } from 'react';
// Eslint unused disabled in case different effect is used.
// eslint-disable-next-line no-unused-vars
import { ToastContainer, toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Some static sample data, could be replaced with live data later.
const outages = ['[RESOLVED] Online leave (https://www.hawaii.edu/leave) is unavailable (Nov 15)'];
const alerts = ['Security Alert: Multiple security vulnerabilities in the SoftEther VPN client'];
const mait = ['Scheduled Maintenance for apply.hawaii.edu (Jan 20)'];
const notices = ['Notice: End of support for macOS 11 (Big Sur)'];

/** A component that renders notifications for landing page, using react-toastify library.
 * @returns A ToastContainer that contains the settings for where toast notifications will appear. */
const Notifications = () => {
  // Sample toast calls
  /* toast.success('success');
    toast.info('info');
    toast.warn('warn');
    toast.error('error'); */

  // Activates toast notifications on page load.
  useEffect(() => {
    notices.forEach((item) => {
      toast.info(item);
    });
    mait.forEach((item) => {
      toast.warn(item);
    });
    outages.forEach((item) => {
      toast.warn(item);
    });
    alerts.forEach((item) => {
      toast.error(item);
    });
  }, []);

  return (
    // This container contains settings for all messages.
    <ToastContainer
      position="bottom-right"
      transition={Slide}
      autoClose={false}
      draggable={false}
      theme="colored"
    />
  );
};

export default Notifications;
