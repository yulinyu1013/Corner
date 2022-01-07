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

const lib = require('../dbOperations/Notifications_query');
const db = require('../db-config');


describe('Notification queries', () => {
  const userId = 'unitTestId1';

  it('get notifications', async() => {
    const res = await lib.getNotifications(db, userId);
    const res2 = await knex.select('notification').from('NotificationReceiver').where('receiver', '=', userId);
    expect(res.length).toBe(res2.length)
  })

  it('get unread notifications', async() => {
    const res = await lib.getUnreadNotificationNum(db, userId);
    // console.log(res);
    expect(res).toBe(0);
  })

  it('update notification', async() => {
    const res = await lib.updateNotification(db,'404unfound', userId, 'approved');
    expect(res).toBe('success');
  })
})