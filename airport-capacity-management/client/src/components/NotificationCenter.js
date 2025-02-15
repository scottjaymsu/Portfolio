import React from 'react';
import { FaBell } from 'react-icons/fa';
import './component.css';

const NotificationCenter = ({ notifications, visible, toggleVisibility }) => {
  return (
    <div id="notification-center" className={visible ? 'visible' : ''}>
      <button id="notif-toggle" onClick={toggleVisibility}>
        <FaBell size={20} />
      </button>
      <div id="notif-list">
        {notifications.map((notif, index) => (
          <i className="notif-wrapper" key={index}>
            {notif}
          </i>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
