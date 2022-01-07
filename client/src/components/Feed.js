import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
// import { useParams } from 'react-router';
import 'antd/dist/antd.css';
import option from '../images/more_vertical.svg';
import '../styles/feed.css';
import logo from '../images/logo.png';
import Comment from './Comment';
import { sendNotificationsforFlagPost } from '../fetchers/notificationApis';
import { updatePost } from '../fetchers/feedsApi';

function Feed({
  post,
  comments,
  deletePostHandler,
  setAllComments,
  allComments,
  allPosts,
  setAllPosts,
  cornerid,
  allUsers,
  admins,
  isLoggedIn,
  userName,
  avatar,
  userId,
  isAdmin,
}) {
  // all values below should get from localstorage or params
  // let { cornerId } = useParams();
  const cornerId = cornerid;
  // const userId = '1'; // get from localstorage
  // const userName = 'test'; // get from localstorage
  // const isAdmin = false; // get from localstroage
  const [flagged, setFlgged] = useState(post.isFlagged === 1);

  const flagPost = () => {
    if (!flagged) {
      setFlgged(true);
      const receivers = admins.join(',');
      sendNotificationsforFlagPost(userName, userId, receivers, cornerId, post.id);
      const flag = { isFlagged: 1 };
      updatePost(post.id, flag);
    }
  };

  const hidePost = () => {
    const newPosts = allPosts.map((p) => {
      if (p.id === post.id) {
        if (p.isHidden === 0) {
          p.isHidden = 1;
          const hidden = { isHidden: 1 };
          updatePost(post.id, hidden);
        } else {
          p.isHidden = 0;
          const hidden = { isHidden: 0 };
          updatePost(post.id, hidden);
        }
      }
      return p;
    });
    setAllPosts(newPosts);
  };

  const menu = (
    <Menu style={{ borderRadius: '7px', width: 100 }}>
      <Menu.Item key={1}>
        <div className="dropdown-item" role="presentation" onClick={() => { flagPost(); }}>{flagged ? 'Flagged' : 'Flag'}</div>
      </Menu.Item>
      {(post.creator === userId || isAdmin) && (
        <Menu.Item key={2}>
          <div className="dropdown-item" role="presentation" onClick={() => { hidePost(); }}>{post.isHidden === 0 ? 'Hide' : 'Unhide'}</div>
        </Menu.Item>
      )}
      {(post.creator === userId || isAdmin) && (
        <Menu.Item key={3}>
          <div className="dropdown-item" role="presentation" onClick={() => { deletePostHandler(post.id); }}>Delete</div>
        </Menu.Item>
      )}
    </Menu>
  );
  const dateTime = new Date(post.createdAt).toLocaleDateString();
  const [showMorePics, setShowMorePics] = useState(false);

  const showMorePicsHandler = () => {
    setShowMorePics(true);
  };

  return (
    <div className="feed-content">
      <div className="user-info">
        <div className="left-info">
          <img className="user-pic" src={post.avatar ? post.avatar : logo} alt="user-pic" />
          <div className="title">
            <p className="user-name">{`${post.creatorName} in ${post.cornerName}`}</p>
            {post.isHidden === 1 && <p className="user-hidden">The post is hidden</p>}
          </div>
        </div>
        <div className="right-info">
          <p className="time">{dateTime}</p>
          {cornerId
            && (
            <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
              <img className="option" src={option} alt="option" />
            </Dropdown>
            )}
        </div>
      </div>
      <div className="post-content">
        <p className="text-content">{post.text}</p>
        {post.pic && post.pic.length > 0 && (
          <div className="feed-all-image">
            {post.pic.slice(0, 2).map((image) => (
              <img key={image} src={typeof image === 'string' ? image : Object.values(image)} alt="uploaded-pics" />
            ))}
            {!showMorePics && post.pic.length > 2 && (
              <div className="show-more-block" style={{ backgroundImage: `url(${Object.values(post.pic[2])})` }} role="presentation" onClick={() => showMorePicsHandler()}>click to show more</div>
            )}
            {showMorePics && (
              post.pic.slice(2).map((image) => (
                <img key={image} src={typeof image === 'string' ? image : Object.values(image)} alt="uploaded-pics" />
              ))
            )}
          </div>
        )}
        {post.video && (
          <div className="feed-video">
            <video src={post.video} controls><track kind="captions" /></video>
          </div>
        )}
        {post.audio && (
          <div className="feed-audio">
            <audio src={typeof post.audio === 'string' ? post.audio : Object.values(post.audio)} controls><track kind="captions" /></audio>
          </div>
        )}
      </div>
      <div className="reaction">
        {/* <img className="like-icon" src={like} alt="likes" />
        <p>5</p> */}
        <p>·</p>
        <p>{`${comments.length} comments`}</p>
      </div>
      <div className="comment-part">
        <Comment
          cornerId={post.corner}
          comment={comments}
          pid={post.id}
          setAllComments={setAllComments}
          allComments={allComments}
          isfromCornerPage={cornerId}
          allUsers={allUsers}
          cornerName={post.cornerName}
          isLoggedIn={isLoggedIn}
          userName={userName}
          avatar={avatar}
          userId={userId}
        />
      </div>
    </div>
  );
}

export default Feed;
