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

jest.setTimeout(60000);

const request = require('supertest');
const webapp = require('../server');
const db = require('../db-config');

afterAll(async () => {
  await webapp.close();
  await new Promise(resolve => setTimeout(async () => {
    resolve();
    await knex('UserInCorner').where('user', '1').del();
    db.end();
  }, 1000)); // avoid jest open handle error
});

describe('add user into corner, get userId, check admin, deleteUserFromcorner', () => {
  // const user = {
  //   userId: '1',
  //   cornerId: '1',
  //   level: 2,
  // }
  test('add user into corner, then delete', async () => {
    await request(webapp).post('/api/adduserintocorner/1/1/2')
    .expect(200)
    .then( async () => {
      await request(webapp).delete('/api/deleteuserfromcorner/1/1')
      .expect(200);
    })
  });

  test('check reques to join corner', async () => {
    await request(webapp).get('/api/checkrequest/10086/nosuchuser')
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text)).toBe(false);
    })
  });

  test('check reques to join corner', async () => {
    await request(webapp).get('/api/checkjoinned/10086/nosuchuser')
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text)).toBe(false);
    })
  });

  test('check admin', async () => {
    await request(webapp).get('/api/checkAdmin/1/1')
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text)).toBe(false);
    })
  })

  test('get userid by name', async () => {
    await request(webapp).get('/api/getuserId/nosuchuser')
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text)).toBe(null);
    })
  })
})