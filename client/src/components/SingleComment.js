import React from 'react';
import logo from '../images/logo.png';
import '../styles/singlecomment.css';
import { deletePost } from '../fetchers/feedsApi';

function SingleComment({
  singlecomment,
  setIsEditing,
  setCommentText,
  allComments,
  setAllComments,
  userId,
}) {
  const dateTime = new Date(singlecomment.updatedAt).toLocaleDateString();

  const onEditing = () => {
    setIsEditing({ condition: true, id: singlecomment.id });
    setCommentText(singlecomment.text);
  };

  const onDelete = () => {
    deletePost(singlecomment.id).then(() => {
      const updated = allComments.filter((post) => post.id !== singlecomment.id);
      setAllComments(updated);
    });
  };

  return (
    <div className="single-comment">
      <div className="top-content">
        <img className="comment-pic" src={singlecomment.avatar ? singlecomment.avatar : logo} alt="commentUser" />
        <div className="grey-box">
          <p>{singlecomment.creatorName}</p>
          <p>{singlecomment.text}</p>
        </div>
      </div>
      <div className="comment-operation">
        {singlecomment.creator === userId && <p className="icon" onClick={onEditing} role="presentation">edit</p>}
        {singlecomment.creator === userId && <p className="icon" onClick={onDelete} role="presentation">delete</p>}
        <p>{dateTime}</p>
      </div>
    </div>
  );
}

export default SingleComment;
