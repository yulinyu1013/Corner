const { v4: uuidv4 } = require('uuid');

// a helper function to make a record clean
const reformtMsg = (m, aAndN) => {
  console.log(aAndN);
  const avaNa = aAndN.filter((an) => an.name === m.senderName);
  let ava = null;
  if (avaNa[0]) {
    ava = avaNa[0].avatar;
  }
  const msg = {
    sender: {
      username: m.senderName,
      avatar: ava,
    },
    text: m.text,
    attachments: [{ file: m.file }],
  };
  return msg;
};

/**
 * fetch a msg from db
 * @param {*} db
 * @param {*} groupId
 * @returns
 */
const fetchAMsg = async (db, msgId) => {
  const query = `SELECT * FROM Message WHERE id='${msgId}'`;
  try {
    const [row] = await db.promise().execute(query);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

/**
 * get avatar by username
 * @param {*} db
 * @param {*}
 * @returns
 */
const getAvatarByName = async (db, userName) => {
  const query = `SELECT name, avatar FROM User WHERE name = '${userName}'`;
  const [row] = await db.promise().execute(query);
  return row[0];
};

/**
 * Create a new private message
 * @param {*} db
 * @param {*} newPMessage
 * @returns
 */
const insertPMsg = async (db, newPMessage) => {
  const uuid = uuidv4();
  const query = `INSERT INTO Corner.Message (id, senderName, type, text, chatRoom, file) VALUES('${uuid}',?,?,?,?,?)`;
  const params = [
    newPMessage.senderName,
    newPMessage.type,
    newPMessage.text,
    newPMessage.chatRoom,
    newPMessage.file,
  ];

  try {
    await db.promise().execute('SET FOREIGN_KEY_CHECKS=0');
    await db.promise().execute(query, params);
    const newMsg = await fetchAMsg(db, uuid);
    return newMsg;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

/**
 * get user and avatar by a chatID
 * @param {*} db
 * @param {*}
 * @returns
 */
const getAvaNameByChatroom = async (db, chatroomId) => {
  const query = `SELECT avatar, name FROM UserInChatroom JOIN User ON UserInChatroom.username=User.name WHERE UserInChatroom.chatroom='${chatroomId}'`;
  const [row] = await db.promise().execute(query);
  return row;
};

/**
 * Create a new group message
 * @param {*} db
 * @param {*} newGMessage
 * @returns
 */
const insertGMsg = async (db, newGMessage) => {
  const uuid = uuidv4();
  const query = `INSERT INTO Corner.Message (id, senderName, type, text, chatRoom, file, corner) VALUES('${uuid}',?,?,?,?,?,?)`;
  const params = [
    newGMessage.senderName,
    newGMessage.type,
    newGMessage.text,
    newGMessage.chatRoom,
    newGMessage.file,
    newGMessage.corner,
  ];

  try {
    await db.promise().execute('SET FOREIGN_KEY_CHECKS=0');
    await db.promise().execute(query, params);
    const newMsg = await fetchAMsg(db, uuid);
    return newMsg;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

/**
 * fetch a chatroom id based the two users name
 * @param {*} db
 * @param {*} groupId
 * @returns
 */
const fetchChatroom = async (db, sender, receiver) => {
  const query = `WITH C1 AS (SELECT chatroom FROM UserInChatroom WHERE username='${sender}'),
  C2 AS (SELECT chatroom FROM UserInChatroom WHERE username='${receiver}'),
  A AS (SELECT * FROM Chatroom)
  SELECT C1.chatroom FROM C1 JOIN C2 ON C1.chatroom=C2.chatroom JOIN A ON C1.chatroom=A.id WHERE A.type='private'`;
  try {
    const [row] = await db.promise().execute(query);
    // if the Chatroom exists
    if (row[0] !== null && row[0] !== undefined) {
      return row[0].chatroom;
    }

    // if the Chatroom does not exist, create a new chatroom,
    // and add user into the userinchatroom table.
    const newChatRoom = uuidv4();
    const query1 = `INSERT INTO Chatroom (id, type) VALUES('${newChatRoom}','private')`;
    const query2 = `INSERT INTO UserInChatroom (username, chatroom) VALUES('${sender}','${newChatRoom}')`;
    const query3 = `INSERT INTO UserInChatroom (username, chatroom) VALUES('${receiver}','${newChatRoom}')`;
    await db.promise().execute(query1);
    await db.promise().execute(query2);
    await db.promise().execute(query3);
    console.log('----');
    console.log(newChatRoom);
    console.log(newChatRoom);
    console.log('----');
    return newChatRoom;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

/**
 * fetch a chatroom id based the two users name
 * @param {*} db
 * @param {*} groupId
 * @returns
 */
const fetchChatroomByCorner = async (db, groupId) => {
  const query = `SELECT * FROM Corner WHERE id='${groupId}'`;
  try {
    const [row] = await db.promise().execute(query);
    return row[0].chatId;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

/**
 * get all messges under a chatroom
 */
const getAllMessages = async (db, chatroomId) => {
  const query = `SELECT * FROM Message WHERE chatRoom='${chatroomId}' ORDER BY timestamp`;
  try {
    const [row] = await db.promise().execute(query);
    const aAndN = await getAvaNameByChatroom(db, chatroomId);
    const data = row.map((g) => {
      const m = reformtMsg(g, aAndN);
      return m;
    });
    return data;
  } catch (err) {
    console.log(err);
    throw new Error('Error executing the query');
  }
};
module.exports = {
  insertPMsg,
  fetchChatroomByCorner,
  insertGMsg,
  fetchAMsg,
  fetchChatroom,
  getAllMessages,
  getAvatarByName,
};
