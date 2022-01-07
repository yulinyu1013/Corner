const { v4: uuidv4 } = require('uuid');

const getNotifications = async (db, userId) => {
  const query = `SELECT * FROM Corner.Notification
                 LEFT JOIN NotificationReceiver
                 ON NotificationReceiver.notification = Notification.id
                 WHERE NotificationReceiver.receiver = ?`;
  const params = [userId];
  try {
    const [rows] = await db.promise().execute(query, params);
    return rows;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const sendNotifications = async (db, receiverIds, notification) => {
  const notificationId = uuidv4();
  const Notificationquery = `INSERT INTO Corner.Notification (id,sender,relatedCorner,relatedPost, type, content, isRead, cornerName)
                             VALUES('${notificationId}',?,?,?,?,?,?,?)`;
  const params = [
    notification.sender,
    notification.relatedCorner,
    notification.relatedPost,
    notification.type,
    notification.content,
    notification.isRead,
    notification.cornerName,
  ];

  console.log(params);

  try {
    await db.promise().execute('SET FOREIGN_KEY_CHECKS=0');
    await db.promise().execute(Notificationquery, params);
    receiverIds.forEach(async (receiverId) => {
      await db.promise().execute('SET FOREIGN_KEY_CHECKS=0');
      await db.promise().execute('INSERT INTO Corner.NotificationReceiver (notification, receiver) VALUES (?,?)', [notificationId, receiverId]);
    });
    return 'success';
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const updateNotification = async (db, notificationId, receiverId, mode) => {
  let query = '';
  if (mode) {
    query = `UPDATE Corner.Notification SET isRead = true, ${mode} = true WHERE id=?`;
  } else {
    query = 'UPDATE Corner.Notification SET isRead = true WHERE id=?';
  }
  const params = [notificationId];

  try {
    await db.promise().execute('SET FOREIGN_KEY_CHECKS=0');
    await db.promise().execute(query, params);
    const [row] = await db.promise().execute(`SELECT COUNT(*) FROM Corner.NotificationReceiver WHERE notification = '${notificationId}'`);
    const currNUm = Number(row[0]['COUNT(*)']);
    // handle admins
    if (receiverId && currNUm > 1) {
      const queryToRemoveOtherRec = 'DELETE FROM Corner.NotificationReceiver WHERE notification = ? and receiver != ?';
      const paramsToRemove = [notificationId, receiverId];
      await db.promise().execute(queryToRemoveOtherRec, paramsToRemove);
    }
    return 'success';
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const getUnreadNotificationNum = async (db, userId) => {
  const query = `SELECT COUNT(*) FROM Corner.Notification
                 LEFT JOIN NotificationReceiver
                 ON NotificationReceiver.notification = Notification.id
                 WHERE NotificationReceiver.receiver = ?
                 and Notification.isRead = 0`;
  const params = [userId];
  try {
    const [row] = await db.promise().execute(query, params);
    const currNUm = Number(row[0]['COUNT(*)']);
    return currNUm;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

module.exports = {
  getNotifications,
  sendNotifications,
  updateNotification,
  getUnreadNotificationNum,
};
