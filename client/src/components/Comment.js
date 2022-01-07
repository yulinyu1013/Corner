import React, { useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import SingleComment from './SingleComment';
import '../styles/comment.css';
import logo from '../images/logo.png';
import { textOperation, style } from './MentionComponent';
import { createComment, updateComment } from '../fetchers/feedsApi';
import { sendNotificationsForMention } from '../fetchers/notificationApis';

function Comment({
  comment,
  pid,
  setAllComments,
  allComments,
  cornerId,
  allUsers,
  cornerName,
  isLoggedIn,
  avatar,
  userId,
  userName,
}) {
  const [commentText, setCommentText] = useState('');
  const [isediting, setIsEditing] = useState({ condition: false, id: null });
  // const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  // const userId = userInfo ? userInfo.id : '1';
  // const userName = userInfo ? userInfo.name : 'not logged in';
  // const cornerName = 'testcornerName';
  const users = allUsers;

  const sendNotification = (nameList, postId) => {
    if (nameList.length > 0) {
      let receivers = '';
      nameList.forEach((e) => {
        receivers += `${e.id},`;
      });
      receivers = receivers.slice(0, receivers.length - 1);
      sendNotificationsForMention(userName, userId, receivers, postId, cornerId, 'comment');
    }
  };

  const changeText = (e) => {
    const innerText = e.target.value;
    setCommentText(innerText);
  };

  const submitComment = async () => {
    console.log(cornerId);
    let res = {};
    let submitText = commentText;
    if (commentText.includes('@')) {
      res = textOperation(commentText);
      submitText = res.mentionList;
      console.log(res);
    }

    if (!isediting.condition) {
      const data = await createComment(userId,
        userName,
        cornerId,
        cornerName,
        submitText,
        pid,
        avatar);
      const updatedComment = [data, ...allComments];
      setAllComments(updatedComment);
    } else {
      const updatedId = isediting.id;
      // call api to update this comment in backend
      updateComment(updatedId, submitText).then(() => {
        const updated = allComments.find((p) => p.id === updatedId);
        updated.text = submitText;
        updated.updatedAt = new Date().toISOString();
        setIsEditing({ condition: false, id: null });
      });
    }
    setCommentText('');

    if (commentText.includes('@') && res.nameList.length > 0) {
      sendNotification(res.nameList, pid);
    }
  };

  const cancelEdit = () => {
    setCommentText('');
    setIsEditing({ condition: false, id: null });
  };

  const onMentionAdd = () => {
    // on add
    // console.log(id, display);
  };

  const searchTermCallBack = (search) => {
    const arr = users.filter((u) => u.display.toLowerCase().startsWith(search.toLowerCase()));
    return arr;
  };

  const displayTransForm = (id, display) => `@${display}`;

  return (
    <div className="comment-list">
      <div className="comment-content">
        {comment.map((c) => (
          <SingleComment
            key={c.id}
            singlecomment={c}
            setIsEditing={setIsEditing}
            setCommentText={setCommentText}
            allComments={allComments}
            setAllComments={setAllComments}
            userId={userId}
          />
        ))}
      </div>
      {isLoggedIn && (
        <div className="comment-box">
          <img className="user" src={avatar || logo} alt="user" />
          <MentionsInput
            className="input"
            value={commentText}
            placeholder="Write a comment..."
            onChange={changeText}
            singleLine
            style={style}
            allowSuggestionsAboveCursor
          >
            <Mention
              trigger="@"
              data={(search) => searchTermCallBack(search)}
              onAdd={onMentionAdd}
              appendSpaceOnAdd
              markup="@[__display__]*[__id__]"
              displayTransform={(id, display) => displayTransForm(id, display)}
            />
          </MentionsInput>
          <button type="submit" onClick={submitComment}>{isediting.condition ? 'UPDATE' : 'POST'}</button>
          {isediting.condition && <button className="cancel-edit-button" type="submit" onClick={cancelEdit}>|CANCEL</button>}
        </div>
      )}
    </div>
  );
}

export default Comment;
