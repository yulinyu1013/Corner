import axios from 'axios';

/**
 * get notifications of the user
 * @param {*} userId
 * @returns notifications
 */
export const getNotifications = async (userId) => {
  const url = `https://corner202.herokuapp.com/api/getNotifications/${userId}`;
  const { data } = await axios.get(url);
  return data;
};

/**
 * send notifications when click join
 */
export const sendNotificationsforJoinCorner = async (
  sendername,
  senderId,
  receiverId,
  cornername,
  cornerId,
) => {
  const url = 'https://corner202.herokuapp.com/api/sendNotifications';
  const text = `${sendername} request to join the ${cornername}`;
  const notification = {
    sender: senderId,
    relatedCorner: cornerId,
    relatedPost: null,
    type: 'request',
    content: text,
    isRead: 'false',
    cornerName: cornername,
    receiver: receiverId,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await axios.post(url, notification, config);
};

/**
 *
 * @param {*} sender
 * @param {*} receiver
 * @param {*} cornerId
 */
export const sendNotificationsforInviting = async (
  sendername,
  senderId,
  receiverId,
  cornername,
  cornerId,
) => {
  const url = 'https://corner202.herokuapp.com/api/sendNotifications';
  const text = `${sendername} invited you to join ${cornername}`;
  const notification = {
    sender: senderId,
    relatedCorner: cornerId,
    relatedPost: null,
    type: 'invitation',
    content: text,
    isRead: 'false',
    cornerName: cornername,
    receiver: receiverId,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await axios.post(url, notification, config);
};

/**
 * To send notification to an array of ppl, do it on frontend or backend??
 */
/**
 *
 * @param {*} sender
 * @param {*} receiver
 * @param {*} cornerId
 */
export const sendNotificationsforFlagPost = async (
  sendername,
  senderId,
  receiverId,
  cornerId,
  postId,
) => {
  const url = 'https://corner202.herokuapp.com/api/sendNotifications';
  const text = `${sendername} flagged a post`;

  const notification = {
    sender: senderId,
    relatedCorner: cornerId,
    relatedPost: postId,
    type: 'flag',
    content: text,
    isRead: 'false',
    cornerName: null,
    receiver: receiverId,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await axios.post(url, notification, config);
};

export const sendNotificationsForMention = async (
  sendername,
  senderId,
  receiverId,
  postId,
  cornerId,
  mode,
) => {
  const url = 'https://corner202.herokuapp.com/api/sendNotifications';
  let text = '';
  if (mode === 'comment') {
    text = `${sendername} mentioned you in his/her comment!`;
  } else {
    text = `${sendername} mentioned you in his/her post!`;
  }

  const notification = {
    sender: senderId,
    relatedCorner: cornerId,
    relatedPost: postId,
    type: 'mention',
    content: text,
    isRead: 'false',
    cornerName: null,
    receiver: receiverId,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await axios.post(url, notification, config);
};

export const sendNotificationsOnRequestOperation = async (
  senderId,
  receiverId,
  postId,
  cornerId,
  result,
  cornerName,
) => {
  const url = 'https://corner202.herokuapp.com/api/sendNotifications';
  const text = `Your request to join ${cornerName} has been ${result}`;

  const notification = {
    sender: senderId,
    relatedCorner: cornerId,
    relatedPost: postId,
    type: 'other',
    content: text,
    isRead: 'false',
    cornerName,
    receiver: receiverId,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await axios.post(url, notification, config);
};

/**
 *
 * @param {*} sender
 * @param {*} receiver
 * @param {*} cornerId
 */
export const updateNotification = async (notificationId, userId, mode) => {
  const url = `https://corner202.herokuapp.com/api/updateNotification/${notificationId}`;

  // if (userId || userId !== null) {
  //   body = { receiver: userId, };
  // }
  const body = { receiver: userId, mode };
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await axios.put(url, body, config);
};

export const deleteNotification = async (notificationId) => {
  const url = 'https://corner202.herokuapp.com/api/deleteNotifications';
  await axios.delete(`${url}/${notificationId}`);
};

export const getUnreadNotificationNum = async (userid) => {
  const url = `https://corner202.herokuapp.com/api/getunreadnotificationnum/${userid}`;
  const { data } = await axios.get(url);
  return data;
};

export default {
  getNotifications,
  sendNotificationsforFlagPost,
  sendNotificationsforInviting,
  sendNotificationsforJoinCorner,
  deleteNotification,
  updateNotification,
  getUnreadNotificationNum,
};
