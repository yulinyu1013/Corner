require('dotenv').config();
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : process.env.MYSQL_HOST,
    port : 3306,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DB,
  }
});

const lib = require('../dbOperations/msg_query');
const db = require('../db-config');


describe('Message queries', () => {

  const userId = 'unitTestId1';
  const username = 'unitTest1';
  const cornerId = 'unitTestCornerId';
  const chatRoomId = 'unitTestCornerChatId';

  it('get avatar by name',  async() => {
    const res = await lib.getAvatarByName(db, username);
    // console.log(res);
    expect(res.avatar).toBeNull();
  })

  it('get message',  async() => {
    const res = await lib.fetchAMsg(db, 'msgId');
    // console.log(res);
    expect(res).toBeUndefined();
  })

  it('get chatroom',  async() => {
    const res = await lib.fetchChatroom(db, 'unitTest1', 'unitTest2');
    expect(res).toBeTruthy();

    const res2 = await lib.fetchChatroom(db, 'unitTest1', 'unitTest3');
    expect(res2).toBeTruthy();
    await knex('Chatroom').where('id', res2).del();
  })

  it('get chatroom by group id',  async() => {
    const res = await lib.fetchChatroomByCorner(db, cornerId);
    // console.log(res);
    expect(res).toBe(chatRoomId);
  })

  it('get chatroom messages',  async() => {
    const res = await lib.getAllMessages(db, chatRoomId);
    const res2 = await knex.select('id').from('Message').where('chatRoom', '=', chatRoomId);
    // console.log(res);
    expect(res.length).toBe(res2.length);
  })

  it('send a private msg',  async() => {

    const msg = {
      senderName: 'unitTest1',
      type:'text',
      text:'unit test',
      chatRoom: chatRoomId,
      file: null,
    }
    const res = await lib.insertPMsg(db, msg);
    expect(res).toBeTruthy();
  })



})