import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import Feed from './Feed';
import Navbar from './Navbar';
import '../styles/postdetail.css';
import { getPostAndItsComments } from '../fetchers/feedsApi';
import groupListApis from '../fetchers/groupListApis';
import { checkIfUserHasJoinned } from '../fetchers/userApis';

function PostDetial() {
  const { cornerid, postid, userid } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [hasAccess, setHasAccess] = useState(true); // should get from api
  const [noPost, setNoPost] = useState(false);
  const history = useHistory();

  useEffect(async () => {
    const data = await getPostAndItsComments(postid);
    const singlepost = data.find((p) => p.type === 'post');
    if (!singlepost) {
      setNoPost(true);
      return;
    }
    setPost(singlepost);
    const postcomments = data.filter((c) => c.type === 'comment');
    setComments(postcomments);

    // call api to check if corner is private and if the user is in the group
    const cornerInfo = await groupListApis.fetchAGroup(cornerid);
    const userJoinned = await checkIfUserHasJoinned(cornerid, userid);

    if (cornerInfo.isPublic === 1 || (cornerInfo.isPublic === 0 && userJoinned)) {
      setHasAccess(true);
    } else {
      setHasAccess(false);
    }
  }, []);

  const backtoNotification = () => {
    history.push(`/notification/${userid}`);
  };

  return (
    <div className="post-detail-page">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="back-to-notification" role="presentation" onClick={backtoNotification}>Back to Notifications</div>
      {!noPost && (
        <div className="detail">
          {(hasAccess && post !== {}) ? (
            <Feed
              post={post}
              comments={comments}
              allComments={comments}
              setAllComments={setComments}
              cornerid={cornerid}
              cornerName={post.cornerName}
              isLoggedIn
            />
          ) : (
            <p>The Post is private</p>
          )}
        </div>
      )}
      {noPost && (
        <div>
          <h1>The Post has been deleted!</h1>
        </div>
      )}
    </div>
  );
}

export default PostDetial;
