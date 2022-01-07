import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import '../styles/singleNotification.css';
import ellipse from '../images/Ellipse 7.jpg';
import { updateNotification, sendNotificationsOnRequestOperation, sendNotificationsforJoinCorner } from '../fetchers/notificationApis';
import { addUserIntoCorner, getAdminsOfCorner, checkIfUserHasJoinned } from '../fetchers/userApis';
import { deletePost, updatePost } from '../fetchers/feedsApi';
import groupListApis from '../fetchers/groupListApis';

function SingleNotification(
  {
    notificationId,
    content,
    type,
    isRead,
    relatedPost,
    sender,
    relatedCorner,
    approved,
    dismissed,
    cornerName,
    userId,
  },
) {
  // const userId = '86f8fd2f-57f2-4961-9028-735afecc5cd1'; // get from local stroage
  const [readnotification, setReadNotification] = useState(isRead === 1);
  const [isapproved, setIsApproved] = useState(approved === 1);
  const [isrejected, setIsrejected] = useState(dismissed === 1);
  console.log(cornerName);
  const currentUser = JSON.parse(sessionStorage.getItem('userInfo'));

  const handleRequestsandFlags = () => {
    if (!isapproved && !isrejected) {
      setReadNotification(true);
      setIsApproved(true);
      if (type === 'request') {
        // call apis to add the sender into the corner (get cornerId)
        addUserIntoCorner(relatedCorner, sender, 1);
        // TODO call api to send notification to the sender that the request has been approved
        sendNotificationsOnRequestOperation(userId, sender, null, relatedCorner, 'approved', cornerName);
      } else {
        // call apis to remove this relatedPost from corner
        deletePost(relatedPost);
      }
      updateNotification(notificationId, userId, 'approved');
    }
  };

  const handleRejectionForAdmins = () => {
    if (!isapproved && !isrejected) {
      setIsrejected(true);
      setReadNotification(true);
      updateNotification(notificationId, userId, 'dismissed');
      if (type === 'request') {
        sendNotificationsOnRequestOperation(userId, sender, null, relatedCorner, 'rejected', cornerName);
      }
      if (type === 'flag') {
        const flag = { isFlagged: 0 };
        updatePost(relatedPost, flag);
      }
    }
  };

  const handleRejection = () => {
    if (!isapproved && !isrejected) {
      setIsrejected(true);
      setReadNotification(true);
      updateNotification(notificationId, null, 'dismissed');
    }
  };

  const joinGroup = async () => {
    if (!isapproved && !isrejected) {
      setIsApproved(true);
      setReadNotification(true);
      updateNotification(notificationId, null, 'approved');
      console.log(relatedCorner);
      console.log(userId);
      // check if private
      const corner = await groupListApis.fetchAGroup(relatedCorner);
      console.log(corner);
      const userJoinned = await checkIfUserHasJoinned(relatedCorner, currentUser.id);
      console.log('userjoin', userJoinned);
      if (corner.isPublic === 0 && !userJoinned) {
        // send notification to all admins
        // get admins of this corner
        let admins = await getAdminsOfCorner(relatedCorner);
        admins = admins.join(',');
        console.log('admins', admins);
        console.log(currentUser);
        sendNotificationsforJoinCorner(
          currentUser.name,
          currentUser.id,
          admins,
          corner.name,
          corner.id,
        );
        message.info('The corner is private, corner admins will review your request.');
      } else {
        // call api to add this user to the corner
        addUserIntoCorner(relatedCorner, userId, 1);
      }
    }
  };

  const handleRead = () => {
    setReadNotification(true);
    updateNotification(notificationId, null, null);
  };
  return (
    <div className="single-notification" role="presentation">
      {!readnotification ? (
        <div className="dot-img">
          <img className="dot" src={ellipse} alt="dot" />
        </div>
      ) : (
        <div className="dot-img" />
      )}
      <div className="notification-content">
        {/* <p>{notificationContent}</p> */}
        { type === 'flag' || type === 'mention' ? <Link onClick={handleRead} to={`/postdetail/${relatedCorner}/${relatedPost}/${userId}`}>{content}</Link> : <p>{content}</p>}
        { (type === 'request') && (
          <div className="notification-button">
            <button className="btn" type="submit" onClick={() => { handleRequestsandFlags(); }}>{ isapproved ? 'Approved' : 'Approve' }</button>
            <button className="btn" type="submit" onClick={() => { handleRejectionForAdmins(); }}>{ isrejected ? 'Rejected' : 'Reject' }</button>
          </div>
        )}
        { type === 'flag' && (
          <div className="notification-button">
            <button className="btn" type="submit" onClick={() => { handleRequestsandFlags(); }}>{ isapproved ? 'Deleted' : 'Delete' }</button>
            <button className="btn" type="submit" onClick={() => { handleRejectionForAdmins(); }}>{ isrejected ? 'Rejected' : 'Reject' }</button>
          </div>
        )}
        { (type === 'invitation') && (
          <div className="notification-button">
            <button className="btn" type="submit" onClick={() => { joinGroup(); }}>{ isapproved ? 'Approved' : 'Approve' }</button>
            <button className="btn" type="submit" onClick={() => { handleRejection(); }}>{ isrejected ? 'Dismissed' : 'Dismiss' }</button>
          </div>
        )}
        { (type === 'other' || type === 'mention') && (
          <div className="notification-button other">
            <button className="btn" type="submit" onClick={() => { handleRejection(); }}>Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleNotification;
