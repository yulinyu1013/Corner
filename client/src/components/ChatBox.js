import React, { useEffect, useState } from 'react';
import MyMessage from './MyMessage';
import TheirMessage from './TheirMessage';
import MessageForm from './MessageForm';
import '../styles/chatbox.css';
import chatApis from '../fetchers/chatApis';

function ChatBox({
  isPrivate,
  cornerId,
  currentUser,
  chatUser,
}) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPrivate) {
        const user1 = currentUser;
        const user2 = chatUser;
        chatApis.fetchPrivateChatHistory(user1, user2).then((res) => {
          setMessages(res);
        });
      } else {
        const groupID = cornerId;
        chatApis.fetchGroupChatHistory(groupID).then((res) => {
          setMessages(res);
        });
      }
    }, 500);
    return () => clearInterval(interval);
  }, [messages]);

  // const AlwaysScrollToBottom = () => {
  //   const elementRef = useRef();
  //   useEffect(() => elementRef.current.scrollIntoView());
  //   return <div ref={elementRef} />;
  // };

  const chatName = chatUser;
  const userName = currentUser;
  const subtitle = isPrivate ? 'private chat' : 'group chat';

  const inputMessage = (newMessage) => {
    // const temp = [...messages];
    if (isPrivate) {
      chatApis.insertNewPrivateMessage(currentUser, chatUser, newMessage).then(() => {
        console.log('upload new message');
      });
    } else {
      chatApis.insertNewGroupMessage(currentUser, cornerId, newMessage).then(() => {
        console.log('upload new message');
      });
    }
  };

  const renderMessages = () => {
    const keys = Object.keys(messages);

    return keys.map((key, index) => {
      const message = messages[key];
      const lastMessageKey = index === 0 ? null : keys[index - 1];
      const isMyMessage = userName === message.sender.username;

      return (
        <div style={{ width: '100%' }}>
          <div className="message-block">
            {isMyMessage
              ? <MyMessage message={message} />
              : <TheirMessage message={message} lastMessage={messages[lastMessageKey]} />}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="chat-area">
      <div className="chat-title-container">
        <div className="chat-title">{chatName}</div>
        <div className="chat-subtitle">
          {subtitle}
        </div>
      </div>
      <div className="chat-feed">
        <div className="blank" />
        {renderMessages()}
        <div style={{ height: '100px' }} />
      </div>
      <div className="message-form-container">
        <MessageForm inputMessage={inputMessage} userName={userName} />
      </div>
    </div>
  );
}

export default ChatBox;
