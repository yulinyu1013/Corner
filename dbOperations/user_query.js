// User in Corner Queries
/**
 * Fetch all members in a corner
 * @param {*} db
 * @param {*} groupId
 * @returns
 */
const fetchMemberList = async (db, groupId) => {
  const query = 'SELECT User.id, User.name, User.avatar, UserInCorner.level FROM UserInCorner JOIN User ON UserInCorner.user=User.id where corner=? ORDER BY UserInCorner.level DESC';
  const param = [groupId];
  try {
    const [rows] = await db.promise().execute(query, param);
    return rows;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const getUserLevel = async (db, userId, groupId) => {
  const query = 'SELECT User.id, User.name, User.avatar, UserInCorner.level FROM UserInCorner JOIN User ON UserInCorner.user=User.id where corner=? AND User.id=?';
  const params = [groupId, userId];
  try {
    const [rows] = await db.promise().execute(query, params);
    return rows[0];
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const updateUserLevel = async (db, userId, groupId, level) => {
  const query = 'UPDATE UserInCorner SET level = ? where user=? and corner=?';
  const params = [level, userId, groupId];
  try {
    const [rows] = await db.promise().execute(query, params);
    return rows[0];
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const getAllUsers = async (db) => {
  const query = 'SELECT id, name FROM Corner.User';

  try {
    const [rows] = await db.promise().execute(query);
    return rows;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const getAdminsOfCorner = async (db, cornerId) => {
  const query = 'SELECT user FROM Corner.UserInCorner WHERE corner = ? and level > 1';
  const params = [cornerId];
  try {
    const [rows] = await db.promise().execute(query, params);
    return rows;
  } catch (err) {
    console.log(err);
    throw new Error('Error executing the query');
  }
};

// check if has joinned
const getUserFromCorner = async (db, cornerId, userId) => {
  const query = 'SELECT * FROM Corner.UserInCorner WHERE corner = ? and user = ?';
  const params = [cornerId, userId];

  try {
    const [rows] = await db.promise().execute(query, params);
    if (rows.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    throw new Error('Error executing the query');
  }
};

const addUserIntoCorner = async (db, cornerId, userId, level) => {
  await db.promise().execute('SET FOREIGN_KEY_CHECKS=0');
  const query = 'INSERT INTO Corner.UserInCorner (user, corner, level) VALUES (?,?,?)';
  const params = [userId, cornerId, level];
  try {
    const rt = await getUserFromCorner(db, cornerId, userId);
    if (!rt) {
      await db.promise().execute(query, params);
    }
  } catch (err) {
    console.log(err);
    throw new Error('Error executing the query');
  }
};

const getUserId = async (db, userName) => {
  const query = 'SELECT id FROM Corner.User WHERE name = ?';
  const params = [userName];

  try {
    const [row] = await db.promise().execute(query, params);
    if (row === undefined || row.length === 0) {
      return null;
    }
    return row[0];
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const checkHaveSentRequestToJoin = async (db, cornerId, userId) => {
  const query = 'SELECT * FROM Corner.Notification WHERE sender = ? and relatedCorner = ? and type ="request" and approved = 0 and dismissed = 0';
  const params = [userId, cornerId];

  try {
    const [row] = await db.promise().execute(query, params);
    if (row === undefined || row.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const removeUserFromCorner = async (db, cornerId, userId) => {
  const query = 'DELETE FROM Corner.UserInCorner WHERE corner = ? and user = ?';
  const params = [cornerId, userId];
  try {
    const [row] = await db.promise().execute(query, params);
    if (row.affectedRows === 1) {
      return 'success';
    }
    return 'fail';
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const checkAdmin = async (db, cornerId, userId) => {
  const query = 'SELECT * FROM Corner.UserInCorner WHERE corner = ? and user = ? and level > 1';
  const params = [cornerId, userId];

  try {
    const [rows] = await db.promise().execute(query, params);
    if (rows && rows.length >= 1) {
      return true;
    }
    return false;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

module.exports = {
  getUserLevel,
  updateUserLevel,
  fetchMemberList,
  getAllUsers,
  getAdminsOfCorner,
  addUserIntoCorner,
  getUserId,
  checkHaveSentRequestToJoin,
  getUserFromCorner,
  removeUserFromCorner,
  checkAdmin,
};
