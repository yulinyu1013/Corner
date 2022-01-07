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
  await new Promise(resolve => setTimeout(async () => {
    await webapp.close();
    resolve();
    await knex('Corner.Corner').where('name', 'unittestgroupforGroupquery').del();
    db.end();
  }, 10000)); // avoid jest open handle error
});

describe('create group, update group and delete a group', () => {
  const newGroup = {
    name: 'unittestgroupforGroupquery',
    creator: 'test1',
    description: 'test',
    avatar: null,
    chatId: 'Groupqueryfortest',
    isPublic: true,
    tag: 'testtag',
  }

  test('create a group', async () => {
    await request(webapp).post('/api/createGroup').send(newGroup)
    .expect(200)
    .then( async (response) => {
      const res = JSON.parse(response.text);
      expect(res).toHaveProperty('name','unittestgroupforGroupquery');
      const newPost = await knex.select('id').from('Corner.Corner').where('name', 'unittestgroupforGroupquery');
      const idcreated = newPost[0].id;

      await request(webapp).get(`/api/groupInfo/${idcreated}`)
      .expect(200);

      const updateGroup = {
        id: idcreated,
        name: 'unittestgroupforGroupquery',
        creator: 'test1',
        description: 'updatetest',
        avatar: null,
        chatId: 'Groupqueryfortest',
        isPublic: true,
        tag: 'testtag',
      }

      await request(webapp).put('/api/updateGroupInfo').send(updateGroup)
      .expect(200)
      .then((response) => async () => {
        const res = JSON.parse(response.text);
        expect(res).toHaveProperty('name','unittestgroupforGroupquery');
      })

      await request(webapp).delete(`/api/groupInfo/${idcreated}`)
      .expect(200);
    })
  })


  test('get all group for user', async () => {
    await request(webapp).get('/api/allGroups/test1')
      .expect(200)
      .then((response) => async () => {
        const res = JSON.parse(response.text);
        expect(JSON.parse(res.text).length).toBeGreaterThanOrEqual(0);
      })
  })

  test('get all group', async () => {
    await request(webapp).get('/api/allGroups')
      .expect(200)
      .then((response) => async () => {
        const res = JSON.parse(response.text);
        expect(JSON.parse(res.text).length).toBeGreaterThanOrEqual(0);
      })
  })
})