import React from 'react';

const MyMessage = ({ message }) => {
  if (
    message.attachments[0]
    && message.attachments[0] !== null
    && message.attachments[0].file !== null
  ) {
    if (typeof message.attachments[0].file === 'object') {
      message.attachments[0].file = URL.createObjectURL(message.attachments[0].file);
      console.log('ttttt');
      console.log(message.attachments[0].file);
      console.log(typeof message.attachments[0].file);
      console.log('ttttt');
    }
    if (message.attachments[0].file.split('.').pop() === 'jpg' || message.attachments[0].file.split('.').pop() === 'jpeg' || message.attachments[0].file.split('.').pop() === 'png') {
      return (
        <div
          className="message-img"
          style={{
            float: 'right', marginRight: '18px', color: 'white', backgroundColor: 'goldenrod',
          }}
        >
          <img
            src={message.attachments[0].file}
            alt="message-attachment"
            className="message-image"
            style={{ float: 'right' }}
          />
        </div>
      );
    }
    if (message.attachments[0].file.split('.').pop() === 'mp4' || message.attachments[0].file.split('.').pop() === 'm4v' || message.attachments[0].file.split('.').pop() === 'avi' || message.attachments[0].file.split('.').pop() === 'mov') {
      return (
        <div
          className="message-vid"
          style={{
            float: 'right', marginRight: '18px', color: 'white',
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
            float: 'right', marginRight: '18px', color: 'white',
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
        float: 'right', marginRight: '18px', color: 'white', backgroundColor: 'goldenrod',
      }}
    >
      {message.text}
    </div>
  );
};

export default MyMessage;
