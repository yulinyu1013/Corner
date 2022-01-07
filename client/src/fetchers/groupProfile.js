import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:3000';
/* eslint-disable import/prefer-default-export */
export const getGroupInfo = async (cornerId) => axios.get(`https://corner202.herokuapp.com/api/groupInfo/${cornerId}`);

export const updateGroupInfo = async (corner) => {
  const url = 'https://corner202.herokuapp.com/api/updateGroupInfo/';
  const myform = new FormData();
  myform.append('id', corner.id);
  myform.append('name', corner.name);
  myform.append('creator', corner.creator);
  myform.append('description', corner.description);
  myform.append('chatId', corner.chatId);
  myform.append('isPublic', corner.isPublic);
  myform.append('tag', corner.tag);
  myform.append('avatar', corner.avatar);

  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data',
    },
  };

  const res = axios.put(url, myform, config);
  return res;
};
