import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import '../styles/chatpageprivate.css';
import Navbar from './Navbar';
import ChatBox from './ChatBox';
import Profile from './Profile';

function ChatPagePrivate() {
  const { chatUser, userName } = useParams();
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    console.log(userName);
    if (userName) {
      setCurrentUser(JSON.parse(sessionStorage.getItem('userInfo')));
      console.log(JSON.stringify(currentUser));
      // console.log(cur);
    }
  }, []);

  return (
    <div className="chatpage-private-container">
      <div className="navbar">
        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      </div>
      <div className="main-page-private">
        <div className="left">
          <Profile currentUser={currentUser} setCurrentUser={setCurrentUser} isInChat />
        </div>
        <div className="middle">
          <ChatBox isPrivate currentUser={userName} chatUser={chatUser} />
        </div>
      </div>
    </div>
  );
}

export default ChatPagePrivate;
