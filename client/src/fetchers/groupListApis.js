import axios from 'axios';

// const url = './endpoint';

/**
 * Fetch all the group
 * @returns
 */
async function fetchAllGroups() {
  // const groups = await axios.get(url);
  const url = 'https://corner202.herokuapp.com/api/allGroups/';
  const { data } = await axios.get(url);
  return data;
}

/**
 * fetch all public groups
 * @returns
 */
async function fetchAllPublicGroups() {
  // const groups = await axios.get(url);
  const url = 'https://corner202.herokuapp.com/api/allGroups/';
  let { data } = await axios.get(url);
  data = data.filter((g) => g.isPublic);
  return data;
}

/**
 * Fetch user's groups
 * @param {*} userId
 * @returns
 */
async function fetchUserGroups(userId) {
  // const groups = await axios.get(url);
  const url = `https://corner202.herokuapp.com/api/allGroups/${userId}`;
  const { data } = await axios.get(url);
  return data;
}

/**
 * fetch a group by id
 * @param {*} groupId
 * @returns
 */
async function fetchAGroup(groupId) {
  // const group = await axios.get(`${url}/groupInfo/${id}`);
  const url = `https://corner202.herokuapp.com/api/groupInfo/${groupId}`;
  const { data } = await axios.get(url);
  return data;
}

/**
 * delete a group by id
 * @param {*} id
 */
async function deleteAGroup(id) {
  const url = `https://corner202.herokuapp.com/api/groupInfo/${id}`;
  await axios.delete(url);
}

/**
 * create a new group
 * @param {*} newGroup
 * @returns
 */
async function createAGroup(newGroup) {
  // input data should be like:
  // let group =   {
  //   name: "test15d",
  //   creator: "ttteeeessssttt",
  //   description: "dddddtest",
  //   chatId:"tttteeeesssstttt",
  //   avatar: ...,
  //   isPublic: true,
  //   tag: ['is', 'a', 'test']
  // };
  // const myform = new FormData();
  // myform.append('name', newGroup.name);
  // myform.append('creator', newGroup.creator);
  // myform.append('description', newGroup.description);
  // myform.append('chatId', newGroup.chatId);
  // myform.append('avatar', newGroup.avatar);
  // myform.append('isPublic', newGroup.isPublic);
  // myform.append('tag', newGroup.tag);
  const body = newGroup;
  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };

  const retGroup = await axios.post('https://corner202.herokuapp.com/api/createGroup', body, config);
  console.log(retGroup);
  return retGroup;
}

/**
 * update a group
 * @param {*} updatedGroup
 * @returns
 */
async function updateAGroup(updatedGroup) {
  // input data should be like:
  // let group =   {
  //   id: "asdfasd",
  //   name: "test15d",
  //   creator: "ttteeeessssttt",
  //   description: "dddddtest",
  //   chatId:"tttteeeesssstttt",
  //   avatar: ...,
  //   isPublic: true,
  //   tag: ['is', 'a', 'test']
  // };
  const body = updatedGroup;
  // const myform = new FormData();
  // myform.append('id', updatedGroup.id);
  // myform.append('name', updatedGroup.name);
  // myform.append('creator', updatedGroup.creator);
  // myform.append('description', updatedGroup.description);
  // myform.append('chatId', updatedGroup.chatId);
  // myform.append('avatar', updatedGroup.avatar);
  // myform.append('isPublic', updatedGroup.isPublic);
  // myform.append('tag', updatedGroup.tag);
  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };

  const retGroup = await axios.put('https://corner202.herokuapp.com/api/groupInfo', body, config);
  console.log(retGroup);
  return retGroup;
}

export default {
  fetchAllGroups,
  fetchUserGroups,
  fetchAllPublicGroups,
  fetchAGroup,
  deleteAGroup,
  updateAGroup,
  createAGroup,
};
