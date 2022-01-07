import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import '../styles/chatpagegroup.css';
import Navbar from './Navbar';
import ChatBox from './ChatBox';
import MemberList from './MemberList';

function ChatPageGroup() {
  const { cornerId, userName } = useParams();
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    console.log(userName);
    if (userName) {
      setCurrentUser(JSON.parse(sessionStorage.getItem('userInfo')));
      console.log(currentUser);
    }
  }, []);

  return (
    <div className="chatpage-group-container">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="main-page-group">
        <div className="left">
          <ChatBox isPrivate={false} cornerId={cornerId} currentUser={userName} />
        </div>
        <div className="middle">
          <MemberList cornerId={cornerId} currentUser={currentUser} isChat />
        </div>
      </div>
    </div>
  );
}

export default ChatPageGroup;
