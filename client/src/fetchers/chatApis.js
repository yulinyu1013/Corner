import axios from 'axios';
// const url = './endpoint';

async function fetchPrivateChatHistory(user1, user2) {
  // const messagesData = [
  //   {
  //     sender: {
  //       name: 'Yiheng Xiong',
  //       avatar: yx,
  //     },
  //     text: 'hello!',
  //     attachments: [],
  //   },
  // ]

  const url = `https://corner202.herokuapp.com/api/pAllMessages/${user1}/${user2}`;
  const { data } = await axios.get(url);
  return data;
}

async function fetchGroupChatHistory(groupID) {
  const url = `https://corner202.herokuapp.com/api/gAllMessages/${groupID}`;
  const { data } = await axios.get(url);
  // console.log(data);
  return data;
}

async function insertNewPrivateMessage(user1, user2, message) {
  // const groups = await axios.get(url);
  // Mock data
  const url = 'https://corner202.herokuapp.com/api/pMessages';
  const data = new FormData();
  // const form = {
  //   senderName: user1,
  //   text: message.text,
  //   receiverName: user2,
  // };
  data.append('senderName', user1);
  data.append('text', message.text);
  data.append('receiverName', user2);
  if (!message.attachments[0]) {
    data.append('type', 'text');
    data.append('file', null);
    // form.type = 'text';
    // form.file = null;
  } else {
    data.append('type', 'file');
    data.append('file', message.attachments[0].file);
    // form.type = 'file';
    // form.file = message.attachments[0].file;
  }
  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data',
    },
  };
  console.log('--------');
  console.log(data);
  // const body = form;
  // console.log(body);
  const res = await axios.post(url, data, config);
  return res;
}

/**
 * Insert new group message to the group
 * @param {*} user1 the user who sends the data
 * @param {*} groupName
 * @param {*} message
 * @returns
 */
async function insertNewGroupMessage(user1, groupId, message) {
  const url = 'https://corner202.herokuapp.com/api/gMessages';
  const data = new FormData();
  // const form = {
  //   senderName: user1,
  //   text: message.text,
  //   groupName: groupName,
  // };
  data.append('senderName', user1);
  data.append('text', message.text);
  data.append('groupId', groupId);
  if (!message.attachments[0]) {
    data.append('type', 'text');
    data.append('file', null);
    // form.type = 'text';
    // form.file = null;
  } else {
    data.append('type', 'file');
    data.append('file', message.attachments[0].file);
    // form.type = 'file';
    // form.file = message.attachments[0].file;
  }
  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data',
    },
  };
  console.log('--------');
  console.log(data);
  // const body = form;
  // console.log(body);
  const res = await axios.post(url, data, config);
  return res;
}

export default {
  fetchPrivateChatHistory, fetchGroupChatHistory, insertNewGroupMessage, insertNewPrivateMessage,
};
