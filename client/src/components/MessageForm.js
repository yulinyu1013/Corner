import React, { useState } from 'react';
import { FaRegPaperPlane, FaRegFolder } from 'react-icons/fa';
import '../styles/messageform.css';

function MessageForm({ inputMessage, userName }) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  /**
   * Handle when users send text
   * @param {}} event
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const t = value.trim();

    if (t.length > 0) {
      console.log('sent message');
      const newMsg = {
        sender: {
          username: userName,
        },
        text: t,
        attachments: [],
      };
      inputMessage(newMsg);
    }

    setValue('');
  };

  /**
   * Handle when users upload files
   * @param {*} event
   */
  const handleUpload = (event) => {
    // const url = URL.createObjectURL(event.target.files[0]);
    console.log(event.target.files[0]);
    const newUpload = {
      sender: {
        username: userName,
      },
      text: '',
      attachments: [
        {
          file: event.target.files[0],
        },
      ],
    };
    inputMessage(newUpload);
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        className="message-input"
        placeholder="Send a message..."
        value={value}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <label htmlFor="upload-button">
        <span className="image-button">
          <FaRegFolder className="picture-icon" />
        </span>
        <input
          type="file"
          multiple={false}
          id="upload-button"
          style={{ display: 'none' }}
          onChange={handleUpload.bind(this)}
        />
      </label>
      <button type="submit" className="send-button">
        <FaRegPaperPlane className="send-icon" />
      </button>
    </form>
  );
}

export default MessageForm;
