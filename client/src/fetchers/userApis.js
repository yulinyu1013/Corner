import axios from 'axios';

/**
 * Get all members from a group
 * @param {*} groupID
 * @returns
 */
export const getMemberList = async (groupID) => {
  console.log(groupID);
  // standard data format
  // const users = [
  //   {
  //     id: 1,
  //     name: 'Yiheng Xiong',
  //     avatar: yx,
  //     level: 3,
  //   },
  //   {
  //     id: 2,
  //     name: 'Yulin Yu',
  //     avatar: yy,
  //     level: 2,
  //   },
  //   {
  //     id: 3,
  //     name: 'Xinyi Lu',
  //     avatar: xl,
  //     level: 1,
  //   },
  // ];
  const url = `https://corner202.herokuapp.com/api/getMemberList/${groupID}`;
  const { data } = await axios.get(url);
  return data;
};

/**
 * get a user's current level in the current corner
 */
export const getCurrentUserLevel = async (userId, groupId) => {
  const url = `https://corner202.herokuapp.com/api/getUserLevel/${userId}/${groupId}`;
  const { data } = await axios.get(url);
  return data;
};

/**
 * set a user's role
 */
export const setRoleInCorner = async (userId, groupId, level) => {
  const url = `https://corner202.herokuapp.com/api/setUserLevel/${userId}/${groupId}/${level}`;
  const { data } = await axios.put(url);
  return data;
};

/**
 * delete user from corner
 */
export const removeUserFromCorner = async (cornerId, userId) => {
  const url = `https://corner202.herokuapp.com/api/deleteuserfromcorner/${cornerId}/${userId}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const { data } = await axios.delete(url, config);
  return data;
};

/**
 *
 * @returns get all user from a cornerlist
 */
export const getAllUsers = async () => {
  const url = 'https://corner202.herokuapp.com/api/getallusers';
  const { data } = await axios.get(url);
  return data;
};

/**
 * get admins from user, return array of ids
 * @param {*} cornerId
 */
export const getAdminsOfCorner = async (cornerId) => {
  const url = `https://corner202.herokuapp.com/api/getadmins/${cornerId}`;
  const { data } = await axios.get(url);
  const idArr = [];
  data.forEach((item) => {
    idArr.push(item.user);
  });
  return idArr;
};

/**
 * get userId given userName
 */
export const getUserId = async (userName) => {
  const url = `https://corner202.herokuapp.com/api/getuserId/${userName}`;
  const { data } = await axios.get(url);
  return data;
};

/**
 * check if user have sent request to join the group
 */
export const checkHaveSentRequestToJoin = async (cornerId, userId) => {
  const url = `https://corner202.herokuapp.com/api/checkrequest/${cornerId}/${userId}`;
  const { data } = await axios.get(url);
  return data;
};

export const checkIfUserHasJoinned = async (cornerId, userId) => {
  const url = `https://corner202.herokuapp.com/api/checkjoinned/${cornerId}/${userId}`;
  const { data } = await axios.get(url);
  return data;
};
/**
 * Add user into a corner
 */
export const addUserIntoCorner = async (cornerId, userId, level) => {
  const url = `https://corner202.herokuapp.com/api/adduserintocorner/${cornerId}/${userId}/${level}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  await axios.post(url, config);
};

/**
 * check if user is admin of a corner
 */
export const checkAdmin = async (cornerId, userId) => {
  const url = `https://corner202.herokuapp.com/api/checkAdmin/${cornerId}/${userId}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const { data } = await axios.get(url, config);
  return data;
};

export default {
  getMemberList,
  getCurrentUserLevel,
  setRoleInCorner,
  getAdminsOfCorner,
  getUserId,
  checkHaveSentRequestToJoin,
  addUserIntoCorner,
  getAllUsers,
  checkIfUserHasJoinned,
  removeUserFromCorner,
  checkAdmin,
};
