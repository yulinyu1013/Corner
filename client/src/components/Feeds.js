import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
// import { addPost } from '../data/data';
import Feed from './Feed';
import '../styles/feeds.css';
import InputBox from './InputBox';
import {
  getAllUsers,
  getAdminsOfCorner,
  checkAdmin,
  checkIfUserHasJoinned,
} from '../fetchers/userApis';
import {
  getPopularPosts,
  getUserPosts,
  getCornerPosts,
  deletePost,
  getAllComments,
} from '../fetchers/feedsApi';

function Feeds({ isLoggedIn, currentUser, isExplored }) {
  const userId = isLoggedIn && currentUser ? currentUser.id : 'noid';
  const userName = isLoggedIn && currentUser ? currentUser.name : 'noname';
  const avatar = isLoggedIn && currentUser ? currentUser.avatar : null;

  const [allPosts, setAllPosts] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [joinned, setJoinned] = useState(false);
  const { cornerName, cornerId } = useParams();

  const loadPosts = async () => {
    setPageNum(1);
    setHasMore(true);
    console.log('i am getting');
    let data = [];
    if ((!isLoggedIn && !cornerId) || isExplored) {
      data = await getPopularPosts(1);
      if (data.length === 0) {
        setHasMore(false);
      }
      console.log('pop', isLoggedIn);
      console.log(data);
    } else if (isLoggedIn && !cornerId) {
      data = await getUserPosts(userId, 1);
      if (data.length === 0) {
        setHasMore(false);
      }
      console.log('my', isLoggedIn);
      console.log(data);
    } else if (cornerId) {
      data = await getCornerPosts(cornerId, 1);
      if (data.length === 0) {
        setHasMore(false);
      }
      console.log('corner');
      console.log(data);
      // console.log(data);
    }
    // get comments
    const comments = await getAllComments();
    const posts = data.filter((p) => p.isHidden === 0
    || (p.isHidden === 1 && p.creator === userId) || (p.isHidden === 1 && isAdmin));
    setAllPosts(posts);
    setAllComments(comments);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('This will run every 45 second!');
      loadPosts();
    }, 45000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  useEffect(() => {
    loadPosts();
    // get all users
    getAllUsers().then((data) => {
      data = data.map((item) => ({ id: item.id, display: item.name }));
      setAllUsers(data);
    });

    // get admind in this group
    getAdminsOfCorner(cornerId).then((data) => {
      setAllAdmins(data);
    });

    // check if user is admin
    checkAdmin(cornerId, userId).then((data) => {
      // console.log(data);
      setIsAdmin(data);
    });

    // check if joineed
    checkIfUserHasJoinned(cornerId, userId).then((data) => {
      console.log('joinned', data);
      if (data) {
        setJoinned(true);
      }
    });
  }, [currentUser, isLoggedIn]);

  const getComment = (postId) => {
    const commentForPost = allComments.filter((c) => c.pid === postId);
    return commentForPost;
  };

  const fetchMoreData = () => {
    console.log('i am fetching');
    if ((!isLoggedIn && !cornerId) || isExplored) {
      console.log('get called');
      setTimeout(() => {
        getPopularPosts(pageNum + 1).then((data) => {
          if (data.length === 0) {
            setHasMore(false);
            return;
          }
          const load = allPosts.concat(data);
          setAllPosts(load);
        });
      }, 1500);
    } else if (isLoggedIn && !cornerId) {
      setTimeout(() => {
        getUserPosts(userId, pageNum + 1).then((data) => {
          if (data.length === 0) {
            setHasMore(false);
            return;
          }
          const load = allPosts.concat(data);
          setAllPosts(load);
        });
      }, 1500);
    } else if (isLoggedIn && cornerId) {
      // get posts in this corner
      setTimeout(() => {
        getCornerPosts(cornerId, pageNum + 1).then((data) => {
          if (data.length === 0) {
            setHasMore(false);
            return;
          }
          const load = allPosts.concat(data);
          setAllPosts(load);
        });
      }, 1500);
    }
    setPageNum(pageNum + 1);
  };

  const getCaption = () => {
    let caption = '';
    if (isLoggedIn && !cornerId) {
      caption = 'My Feed';
    }

    if ((!isLoggedIn && !cornerId) || isExplored) {
      caption = 'Popular Feed';
    }

    if (cornerId) {
      caption = 'Corner Feed';
    }
    return caption;
  };

  const deletePostHandler = async (id) => {
    deletePost(id).then(() => {
      const updated = allPosts.filter((p) => p.id !== id);
      setAllPosts(updated);
    });
  };

  return (
    <div className="middle-container">
      {(isLoggedIn && cornerId && joinned) && (
        <InputBox
          setAllPosts={setAllPosts}
          setNewPost={setNewPost}
          newPost={newPost}
          // addPost={addPost}
          allPosts={allPosts}
          allUsers={allUsers}
          cornerName={cornerName}
          cornerId={cornerId}
          userName={userName}
          avatar={avatar}
          userId={userId}
        />
      )}
      <div className="corner-caption">
        {getCaption()}
      </div>
      <div className="post-list" id="scrollableDiv">
        <InfiniteScroll
          dataLength={allPosts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
          endMessage="No More Post :)"
        >
          {allPosts.map((post) => (
            <Feed
              key={post.id}
              post={post}
              comments={getComment(post.id)}
              allComments={allComments}
              deletePostHandler={deletePostHandler}
              setAllComments={setAllComments}
              allPosts={allPosts}
              setAllPosts={setAllPosts}
              allUsers={allUsers}
              admins={allAdmins}
              cornerName={cornerName}
              isLoggedIn={isLoggedIn}
              userName={userName}
              avatar={avatar}
              userId={userId}
              isAdmin={isAdmin}
              cornerid={cornerId}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Feeds;
