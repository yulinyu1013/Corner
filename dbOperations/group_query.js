const { v4: uuidv4 } = require('uuid');

// a helper function to make a record clean
const cleanGroupData = (r) => {
  r.tag = r.tag.split('|');
  if (r.posts === null) {
    r.posts = 0;
  }

  if (r.mems === null) {
    r.mems = 0;
  }
  return r;
};

/**
 * fetch a group in db
 * @param {*} db
 * @param {*} groupId
 * @returns
 */
const fetchAGroup = async (db, groupId) => {
  console.log(groupId);
  const query = `With M as (SELECT MAX(timestamp) as msg, corner from Message),
  P as (SELECT COUNT(*) as posts, corner from Post),
  U as (SELECT COUNT(*) as mems, corner from UserInCorner),
  C as (SELECT * FROM Corner where id = '${groupId}')
SELECT C.*, msg, posts, mems FROM C left join M ON C.id=M.corner left join P on P.corner = M.corner left join U on U.corner = P.corner`;
  try {
    const [row] = await db.promise().execute(query);
    console.log(row[0]);
    return row[0];
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

/**
 * Insert a new Group to db
 * @param {*} db
 * @param {*} newGroup
 * @returns
 */
const insertAGroup = async (db, newGroup) => {
  const uuid1 = uuidv4();
  const uuid2 = uuidv4();
  console.log(newGroup);
  const query = `INSERT INTO Corner.Corner (id, name, creator, description, avatar, chatId, isPublic, tag) VALUES('${uuid1}',?,?,?,?,'${uuid2}',?,?)`;
  const params = [
    newGroup.name,
    newGroup.creator,
    newGroup.description,
    newGroup.avatar,
    newGroup.isPublic,
    newGroup.tag,
  ];

  console.log(`${uuid1}`);
  console.log(params);

  try {
    // create a chatroom
    const query2 = `INSERT INTO Corner.Chatroom (id, type) VALUES('${uuid2}', 'group')`;
    await db.promise().execute(query2);

    // create a group
    await db.promise().execute('SET FOREIGN_KEY_CHECKS=0');
    await db.promise().execute(query, params);
    let newgroup = await fetchAGroup(db, uuid1);
    newgroup = cleanGroupData(newgroup);

    // update user in group
    const query3 = `INSERT INTO Corner.UserInCorner(user, corner, level) VALUES(? ,'${uuid1}', ?)`;
    const params3 = [newgroup.creator, 3];
    await db.promise().execute(query3, params3);

    return newgroup;
  } catch (err) {
    console.log(err);
    throw new Error('Error executing the query');
  }
};

/**
 * update a new group to db
 * @param {*} db
 * @param {*} updateGroup
 * @returns
 */
const updateAGroup = async (db, updateGroup) => {
  const query = `UPDATE Corner.Corner SET name=?, creator=?, description=?, avatar=?, chatId=?, isPublic=?, tag=? WHERE id='${updateGroup.id}'`;
  const params = [
    updateGroup.name,
    updateGroup.creator,
    updateGroup.description,
    updateGroup.avatar,
    updateGroup.chatId,
    updateGroup.isPublic,
    updateGroup.tag,
  ];

  try {
    // await db.promise().execute('SET FOREIGN_KEY_CHECKS=0');
    await db.promise().execute(query, params);
    let returnGroup = await fetchAGroup(db, updateGroup.id);
    returnGroup = cleanGroupData(returnGroup);
    // transfer a tag string to an array
    return returnGroup;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

/**
 * delete a group from db
 * @param {*} db
 * @param {*} groupId
 * @returns
 */
const deleteAGroup = async (db, groupId) => {
  console.log(groupId);
  const query = `DELETE FROM Corner WHERE id='${groupId}'`;
  try {
    const [row] = await db.promise().execute(query);
    if (row.affectedRows === 1) {
      return 'Succeed to delete a record';
    }
    return 'fail to delete';
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

/**
 * fetch all groups in db
 * @param {*} db
 * @param {*} groupId
 * @returns
 */
const fetchAllGroups = async (db) => {
  const query = `With M as (SELECT MAX(timestamp) as msg, corner from Message GROUP BY corner),
  P as (SELECT COUNT(*) as posts, corner from Post GROUP BY corner),
  U as (SELECT COUNT(*) as mems, corner from UserInCorner GROUP BY corner)
  SELECT Corner.*, msg, posts, mems FROM Corner left join P on P.corner = Corner.id left join U on U.corner = P.corner left join M ON U.corner=M.corner WHERE isPublic=1`;
  try {
    const [row] = await db.promise().execute(query);
    const groups = row.map((g) => cleanGroupData(g));
    return groups;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

/**
 * fetch all groups in db
 * @param {*} db
 * @param {*} groupId
 * @returns
 */
const fetchGroupsForAUser = async (db, userId) => {
  const query = `WITH G as (SELECT Corner.* FROM UserInCorner JOIN Corner ON UserInCorner.corner=Corner.id WHERE user = '${userId}'),
  M as (SELECT MAX(timestamp) as msg, corner from Message GROUP BY corner),
  P as (SELECT COUNT(*) as posts, corner from Post GROUP BY corner),
  U as (SELECT COUNT(*) as mems, corner from UserInCorner GROUP BY corner)
  SELECT G.*, msg, posts, mems FROM G left join P on G.id = P.corner left join U on U.corner = P.corner left join M ON U.corner=M.corner`;
  try {
    const [row] = await db.promise().execute(query);
    const groups = row.map((g) => cleanGroupData(g));
    console.log(groups);
    return groups;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

module.exports = {
  insertAGroup,
  fetchAGroup,
  updateAGroup,
  deleteAGroup,
  fetchAllGroups,
  fetchGroupsForAUser,
};
