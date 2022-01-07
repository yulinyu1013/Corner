import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getUnreadNotificationNum } from '../fetchers/notificationApis';
import logo from '../images/logo.png';
// import userPic from '../images/logo.png';
import notification from '../images/notification.png';
import '../styles/navbar.css';

function Navbar({ currentUser, isLoggedIn }) {
  const [notificationNum, setNotificationNum] = useState(0);
  console.log(currentUser);
  // const loggedIn = isLoggedIn;
  const history = useHistory();
  //   const [loggedIn, setLoggedIn] = useState(true);
  const redirectToNotification = () => {
    history.push(`/notification/${currentUser.id}`);
  };

  const user = currentUser === {} ? null : currentUser;

  useEffect(async () => {
    console.log(isLoggedIn);
    if (isLoggedIn) {
      getUnreadNotificationNum(currentUser.id).then((data) => {
        setNotificationNum(data);
      });
    }
  }, [isLoggedIn, currentUser]);

  const redirectToHomepage = () => {
    history.push('/');
  };
  return (
    <div className="navgation-bar">
      <div className="logo" role="presentation" onClick={() => redirectToHomepage()}>
        <img className="logo" src={logo} alt="logo" />
      </div>
      {isLoggedIn && (
      <div className="user-info">
        <img className="small-icon" src={notification} alt="notification" role="presentation" onClick={() => redirectToNotification()} />
        <p>{`(${notificationNum})`}</p>
        <img className="user-pic" src={!user || !user.avatar ? logo : user.avatar} alt="user-avatar" />
        <p className="user-name">{user && user.name}</p>
      </div>
      )}
    </div>
  );
}

export default Navbar;
