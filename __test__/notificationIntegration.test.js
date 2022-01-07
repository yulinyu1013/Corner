const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'database-1.c1o1vrjh3mlc.us-east-1.rds.amazonaws.com',
    port : 3306,
    user : 'admin',
    password : 'cis557corner',
    database : 'Corner',
  }
});

jest.setTimeout(60000);
const request = require('supertest');
const webapp = require('../server');
const db = require('../db-config');

afterAll(async () => {
  await webapp.close();
  await new Promise(resolve => setTimeout(async () => {
    resolve();
    await knex('Notification').where('sender', 'test1').del();
    await knex('NotificationReceiver').where('receiver', 'testReceiver').del();
    db.end();
  }, 1000)); // avoid jest open handle error
});

describe('send notification', () => {
  const text = 'test notification';
  const notification = {
    sender: 'test1',
    relatedCorner: '1',
    relatedPost: null,
    type: 'request',
    content: text,
    isRead: false,
    cornerName: 'testCorner',
    receiver: 'testReceiver',
  };

  it('send notification successfully, update and get', async () => {
    await request(webapp).post('/api/sendNotifications').send(notification)
    .expect(200)
    .then( async () => {
      const newNotification = await knex.select('id').from('Notification').where('sender', 'test1');
      const idcreated = newNotification[0].id;
      console.log(newNotification);

      await request(webapp).get(`/api/getNotifications/testReceiver`)
      .expect(200)
      .then((response1) => {
        console.log(response1.text);
        expect(JSON.parse(response1.text).length).toBe(1);
      })

      await request(webapp).put(`/api/updateNotification/${idcreated}`)
      .expect(200);
    })
  });
});