import React from 'react';

const displayMedia = (message) => {
  if (
    message.attachments[0]
    && message.attachments[0] !== null
    && message.attachments[0].file !== null
  ) {
    console.log();
    message.attachments[0].file = typeof message.attachments[0].file === 'string' ? message.attachments[0].file : URL.createObjectURL(message.attachments[0].file);
    if (message.attachments[0].file.split('.').pop() === 'jpg' || message.attachments[0].file.split('.').pop() === 'jpeg' || message.attachments[0].file.split('.').pop() === 'png') {
      return (
        <div
          className="message-img"
          style={{
            float: 'left', marginRight: '18px', color: 'white', backgroundColor: '#9D9B9B',
          }}
        >
          <img
            src={message.attachments[0].file}
            alt="message-attachment"
            className="message-image"
            style={{ float: 'left' }}
          />
        </div>
      );
    }
    if (message.attachments[0].file.split('.').pop() === 'mp4' || message.attachments[0].file.split('.').pop() === 'm4v' || message.attachments[0].file.split('.').pop() === 'avi' || message.attachments[0].file.split('.').pop() === 'mov') {
      return (
        <div
          className="message-vid"
          style={{
            float: 'left', marginRight: '18px', color: 'white',
          }}
        >
          <video
            src={message.attachments[0].file}
            width="100%"
            height="auto"
            controls
          >
            <track kind="captions" />
          </video>
        </div>
      );
    }
    if (message.attachments[0].file.split('.').pop() === 'mp3') {
      return (
        <div
          className="message-aud"
          style={{
            float: 'left', marginRight: '18px', color: 'white',
          }}
        >
          <audio
            src={message.attachments[0].file}
            controls
          >
            <track kind="captions" />
          </audio>
        </div>
      );
    }
  }
  return (
    <div
      className="message"
      style={{
        float: 'left', marginRight: '18px', color: 'white', backgroundColor: '#9D9B9B',
      }}
    >
      {message.text}
    </div>
  );
};

const TheirMessage = ({ lastMessage, message }) => {
  let isFirstMessageByUser = true;
  if (!lastMessage) {
    isFirstMessageByUser = true;
  } else {
    isFirstMessageByUser = lastMessage.sender.username !== message.sender.username;
  }
  return (
    <div className="message-row">
      {isFirstMessageByUser && (
        <div className="message-sender-title">
          <div className="message-sender-name">
            <p>{message.sender.username}</p>
          </div>
          <div
            className="message-avatar"
            style={{ backgroundImage: message.sender && `url(${message.sender.avatar})` }}
          />
        </div>
      )}
      <div className="message-content">
        {message.attachments && message.attachments.length > 0 && message.attachments[0] !== null
          ? (
            <div>
              {displayMedia(message)}
            </div>
          )
          : (
            <div className="message" style={{ float: 'left', backgroundColor: 'goldenrod', marginLeft: isFirstMessageByUser ? '4px' : '48px' }}>
              {message.text}
            </div>
          )}
      </div>
    </div>
  );
};

export default TheirMessage;
