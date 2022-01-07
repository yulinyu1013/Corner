import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import SingleNotification from './SingleNotification';
import Navbar from './Navbar';
import { getNotifications } from '../fetchers/notificationApis';

function NotificationPage() {
  const { userId } = useParams();
  const [userNotifications, setUserNotifications] = useState([]);

  useEffect(() => {
    getNotifications(userId).then((data) => {
      console.log(data);
      setUserNotifications(data);
    });
  }, []);

  return (
    <div className="notifications">
      <div className="navbar">
        <Navbar />
      </div>
      {userNotifications.map((notification) => (
        <SingleNotification
          key={notification.id}
          userId={userId}
          notificationId={notification.id}
          content={notification.content}
          type={notification.type}
          setUserNotifications={setUserNotifications}
          userNotifications={userNotifications}
          isRead={notification.isRead}
          relatedPost={notification.relatedPost}
          relatedCorner={notification.relatedCorner}
          sender={notification.sender}
          approved={notification.approved}
          dismissed={notification.dismissed}
          cornerName={notification.cornerName}
        />
      ))}
    </div>
  );
}

export default NotificationPage;
