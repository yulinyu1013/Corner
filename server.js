const express = require('express');
const cors = require('cors');
const shortid = require('shortid');

const webapp = express();
const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
require('dotenv').config();

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESSKEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'corner-bucket',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${shortid.generate()}-${file.originalname}`);
    },
  }),
});

const db = require('./db-config');
const feedsApi = require('./dbOperations/feedsApi');
const userApis = require('./dbOperations/user_crud');
const msgQuery = require('./dbOperations/msg_query');
const groupQuery = require('./dbOperations/group_query');
const notificationApi = require('./dbOperations/Notifications_query');
const userApi = require('./dbOperations/user_query');
const analytics = require('./dbOperations/analytics');

webapp.use(express.json());
webapp.use(cors());
webapp.use(
  express.urlencoded({
    extended: true,
  }),
);

webapp.use(express.static(path.join(__dirname, './client/build')));
// webapp.use(fileUpload());
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 },
  { name: 'pic', maxCount: 10 },
  { name: 'file', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 }]);

//////////////////////////////////////////////
////////////// APIs for Users //////////////////
//////////////////////////////////////////////

// register
webapp.post('/api/register', async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(404).json({ error: 'missing infomation' });
    return;
  }
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const user = await userApis.register(db, newUser);
    console.log(`id: ${JSON.stringify(user)}`);
    res.status(201).json(user);
  } catch (err) {
    if (err.message.includes('Duplicate entry')) {
      res.status(409).json({ error: 'The user already exists in the database' });
    } else {
      res.status(404).json({ error: err.message });
    }
  }
});

// login
webapp.post('/api/login', async (req, res) => {
  console.log('login user...');
  console.log(req.body);
  if (!req.body.name || !req.body.password) {
    res.status(404).json({ error: 'missing name or password' });
    return;
  }

  const loginUser = {
    name: req.body.name,
    password: req.body.password,
  };

  try {
    const user = await userApis.login(db, loginUser);
    if (!user) {
      res.status(409).json({ error: 'invalid user or password' });
    } else {
      res.status(201).json(user);
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/getUser/:userId', async (req, res) => {
  try {
    const user = await userApis.getUser(db, req.params.userId);
    if (user !== 'fail') {
      res.status(200).json(user);
    }
    res.status(404).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// delete user
webapp.delete('/api/deleteUser/:username', async (req, res) => {
  if (req.params.username === undefined) {
    res.status(404).json({ error: 'name is missing' });
    return;
  }
  try {
    await userApis.deleteUser(db, req.params.username);
    res.status(200).json({ message: `${req.params.username} deleted.` });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// update user profile
webapp.put('/api/updateUser', cpUpload, async (req, res) => {
  console.log('update user route...');
  let avatar = null;
  console.log(req.files);
  if (req.files && req.files['avatar']) {
    console.log(req.files['avatar']);
    avatar = req.files['avatar'][0].location;
    console.log(avatar);
  }

  const updatedUser = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    bio: req.body.bio,
    avatar: req.body.avatar || avatar,
  };

  try {
    const user = await userApis.updateUser(db, updatedUser);
    res.status(201).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

//////////////////////////////////////////////
//--------------- APIs for Posts -----------//
//////////////////////////////////////////////
webapp.post('/api/createPost', cpUpload, async (req, res) => {
  console.log(req.files);
  let picArr = '';
  let audio = '';
  let video = '';
  // console.log(req.body);
  if (req.files && req.files['audio']) {
    audio = req.files['audio'][0].location;
  } else {
    audio = null;
  }

  if (req.files && req.files['video']) {
    video = req.files['video'][0].location;
  } else {
    video = null;
  }

  if (req.files && req.files['pic']) {
    const pics = req.files['pic'];
    console.log(pics);
    pics.forEach((element) => {
      picArr += `${element.location},`;
    });
    picArr = picArr.slice(0, picArr.length - 1);
  } else {
    picArr = null;
  }

  const newPost = {
    creator: req.body.creator,
    corner: req.body.corner,
    type: 'post',
    text: req.body.text,
    pic: picArr,
    audio,
    video,
    isFlagged: 0,
    isHidden: 0,
    creatorName: req.body.creatorName,
    cornerName: req.body.cornerName,
    avatar: req.body.avatar,
  };

  try {
    const newpost = await feedsApi.createPost(db, newPost);
    console.log(newpost);
    res.status(200).json({ createdpost: newpost });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/getPopularPosts/:page', async (req, res) => {
  const num = req.params.page;
  try {
    const popularFeeds = await feedsApi.getPopularPosts(db, num);
    res.status(200).json(popularFeeds);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/getUserPosts/:id/:page', async (req, res) => {
  const id = req.params.id;
  const num = req.params.page;
  try {
    const userFeeds = await feedsApi.getUserPosts(db, id, num);
    res.status(200).json(userFeeds);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/getCornerPosts/:id/:page', async (req, res) => {
  const id = req.params.id;
  const num = req.params.page;
  try {
    const userFeeds = await feedsApi.getCornerPosts(db, id, num);
    res.status(200).json(userFeeds);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.put('/api/updatePost/:id', async (req, res) => {
  const id = req.params.id;
  const obj = req.body;
  const key = Object.keys(obj)[0];
  const val = obj[key];

  try {
    const updated = await feedsApi.updatePost(db, id, key, val);
    if (updated === 'success') {
      res.status(200).json('success');
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.delete('/api/deletePost/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const rt = await feedsApi.deletePost(db, id);
    if (rt === 'success') {
      res.status(200).json('success');
    } else {
      res.status(404).json('no such post');
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.post('/api/createComment', async (req, res) => {
  try {
    const data = await feedsApi.createComment(db, req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/getComments', async (req, res) => {
  try {
    const data = await feedsApi.getAllComments(db);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.put('/api/updateComment/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const data = await feedsApi.updateComment(db, id, req.body.newText);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/getPost/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const data = await feedsApi.getSinglePost(db, id);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

//////////////////////////////////////////////
//////////////APIs for Groups/////////////////
//////////////////////////////////////////////
/**
 * /POST createGroup to create a group
 */
webapp.post('/api/createGroup', async (req, res) => {
  let token = null;
  if (req.files && req.files['avatar']) {
    token = req.files['avatar'][0].location;
  }

  const newGroup = {
    name: req.body.name,
    creator: req.body.creator,
    description: req.body.description || '',
    avatar: req.body.avatar || token,
    chatId: req.body.chatId,
    isPublic: req.body.isPublic,
    tag: req.body.tag,
  };
  try {
    const retVal = await groupQuery.insertAGroup(db, newGroup);
    res.status(200).json(retVal);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
 * get the groupInfo by cornerId
 */
webapp.get('/api/groupInfo/:cornerId', async (req, res) => {
  const cornerId = req.params.cornerId;
  try {
    const retGroup = await groupQuery.fetchAGroup(db, cornerId);
    return res.status(200).json(retGroup);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

/**
 * Update a group's info
 */
webapp.put('/api/updateGroupInfo', cpUpload, async (req, res) => {
  let token = null;
  if (req.files && req.files['avatar']) {
    token = req.files['avatar'][0].location;
  }

  const updateGroup = {
    id: req.body.id,
    name: req.body.name,
    creator: req.body.creator,
    description: req.body.description,
    avatar: token,
    chatId: req.body.chatId,
    isPublic: req.body.isPublic,
    tag: req.body.tag,
  };

  console.log(updateGroup);

  try {
    const retGroup = await groupQuery.updateAGroup(db, updateGroup);
    return res.status(200).json(retGroup);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

/**
 * delete a group
 */
webapp.delete('/api/groupInfo/:cornerId', async (req, res) => {
  try {
    const retValue = await groupQuery.deleteAGroup(db, req.params.cornerId);
    res.status(200).json(retValue);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
 * fetch all groups
 */
webapp.get('/api/allGroups', async (req, res) => {
  try {
    const retValue = await groupQuery.fetchAllGroups(db);
    console.log(retValue);
    res.status(200).json(retValue);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
 * fetch all groups by a user
 */
webapp.get('/api/allGroups/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const retValue = await groupQuery.fetchGroupsForAUser(db, userId);
    res.status(200).json(retValue);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/////////////// NOTIFICATION APIS //////////////////////
webapp.post('/api/sendNotifications', async (req, res) => {
  const receivers = req.body.receiver.split(',');
  const notification = req.body;
  delete notification['receiver'];

  try {
    const rt = await notificationApi.sendNotifications(db, receivers, notification);
    return res.status(200).json({ message: rt });
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/getNotifications/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const data = await notificationApi.getNotifications(db, id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

webapp.put('/api/updateNotification/:id', async (req, res) => {
  const id = req.params.id;
  const receiver = req.body ? req.body.receiver : null;
  const mode = req.body ? req.body.mode : null;
  try {
    const data = await notificationApi.updateNotification(db, id, receiver, mode);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/getunreadnotificationnum/:userid', async (req, res) => {
  const id = req.params.userid;
  try {
    const data = await notificationApi.getUnreadNotificationNum(db, id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

///////////////// USER APIS /////////////////////
webapp.get('/api/getallusers', async (req, res) => {
  try {
    const data = await userApi.getAllUsers(db);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

webapp.post('/api/adduserintocorner/:cornerId/:userId/:level', async (req, res) => {
  const corner = req.params.cornerId;
  const userId = req.params.userId;
  const level = req.params.level;
  try {
    await userApi.addUserIntoCorner(db, corner, userId, level);
    return res.status(200).json({ message: 'success' });
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/getadmins/:cornerId', async (req, res) => {
  const corner = req.params.cornerId;
  try {
    const data = await userApi.getAdminsOfCorner(db, corner);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/getuserId/:username', async (req, res) => {
  const name = req.params.username;
  try {
    const data = await userApi.getUserId(db, name);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/checkrequest/:cornerId/:userId', async (req, res) => {
  const corner = req.params.cornerId;
  const user = req.params.userId;
  try {
    const data = await userApi.checkHaveSentRequestToJoin(db, corner, user);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/checkjoinned/:cornerId/:userId', async (req, res) => {
  const corner = req.params.cornerId;
  const user = req.params.userId;
  try {
    const data = await userApi.getUserFromCorner(db, corner, user);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/checkAdmin/:cornerId/:userId', async (req, res) => {
  const corner = req.params.cornerId;
  const user = req.params.userId;

  try {
    const data = await userApi.checkAdmin(db, corner, user);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

webapp.delete('/api/deleteuserfromcorner/:cornerId/:userId', async (req, res) => {
  const corner = req.params.cornerId;
  const user = req.params.userId;

  try {
    const data = await userApi.removeUserFromCorner(db, corner, user);
    return res.status(200).json({ message: data });
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});
// ----------------- Msg APIs ------------------------
/**
 * /POST insert a private messages
 */
webapp.post('/api/pMessages', cpUpload, async (req, res) => {
  let token = null;
  console.log('----------');
  console.log(token);
  console.log('----------');
  if (req.files && req.files['file']) {
    token = req.files['file'][0].location;
  } else {
    token = null;
  }
  console.log('----------');
  console.log(token);
  console.log('----------');
  try {
    const chatroomId = await msgQuery.fetchChatroom(db, req.body.senderName, req.body.receiverName);
    const newPMessage = {
      senderName: req.body.senderName,
      text: req.body.text,
      file: token,
      type: req.body.type,
      chatRoom: chatroomId,
    };
    console.log('asdfasd');
    console.log(newPMessage);
    const retMsg = await msgQuery.insertPMsg(db, newPMessage);
    console.log(retMsg);
    return res.status(200).json(retMsg);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

/**
 * get all messages from a private chatroom
 */
webapp.get('/api/pAllMessages/:senderName/:receiverName', async (req, res) => {
  try {
    const chatroomId = await msgQuery.fetchChatroom(
      db,
      req.params.senderName,
      req.params.receiverName,
    );
    const data = await msgQuery.getAllMessages(db, chatroomId);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

/**
 * /POST insert a group messages
 */
webapp.post('/api/gMessages', cpUpload, async (req, res) => {
  let token = null;
  if (req.files && req.files['file']) {
    token = req.files['file'][0].location;
  } else {
    token = null;
  }
  try {
    const chatroomId = await msgQuery.fetchChatroomByCorner(db, req.body.groupId);
    const newGMessage = {
      senderName: req.body.senderName,
      text: req.body.text,
      file: token,
      type: req.body.type,
      chatRoom: chatroomId,
      corner: req.body.groupId,
    };
    const retMsg = await msgQuery.insertGMsg(db, newGMessage);
    return res.status(200).json(retMsg);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

/**
 * get all messages from a group chatroom
 */
webapp.get('/api/gAllMessages/:groupId', async (req, res) => {
  try {
    // console.log("------");
    // console.log("??????");
    // console.log("------");
    // get the chatroomId by groupId
    const chatroomId = await msgQuery.fetchChatroomByCorner(db, req.params.groupId);
    const data = await msgQuery.getAllMessages(db, chatroomId);
    console.log('------');
    console.log(data);
    console.log('------');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});
//////////////////////////////////////////////
//////////////APIs for User in Groups/////////
//////////////////////////////////////////////
/**
 * get member list by group id
 */
webapp.get('/api/getMemberList/:groupId', async (req, res) => {
  try {
    const memberList = await userApi.fetchMemberList(db, req.params.groupId);
    return res.status(200).json(memberList);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

/**
 * get user's level in the corner and etc
 */
webapp.get('/api/getUserLevel/:userId/:groupId', async (req, res) => {
  try {
    const data = await userApi.getUserLevel(db, req.params.userId, req.params.groupId);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

/**
 * update a user's level in an corner
 */
webapp.put('/api/setUserLevel/:userId/:groupId/:level', async (req, res) => {
  try {
    const data = await userApi.updateUserLevel(
      db,
      req.params.userId,
      req.params.groupId,
      req.params.level,
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

///////////// analytics /////////////
webapp.get('/api/analytics/engagement/:cornerId', async (req, res) => {
  try {
    const data = await analytics.getEngagement(db, req.params.cornerId);
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/analytics/post/:cornerId', async (req, res) => {
  try {
    const data = await analytics.getPostStats(db, req.params.cornerId);
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/api/analytics/member/:cornerId', async (req, res) => {
  try {
    const data = await analytics.getMemberGrowth(db, req.params.cornerId);
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

///////////// other /////////////

webapp.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
  // res.send('runninig');
});

webapp.use((_req, res) => {
  res.status(404);
});

// Start server
const port = process.env.PORT || 5000;
const server = webapp.listen(port, () => {
  console.log(`Server running on port:${port}`);
});

module.exports = server;
