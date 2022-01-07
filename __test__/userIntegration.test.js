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

const request = require('supertest');
const webapp = require('../server');
const db = require('../db-config');

afterAll(async () => {
  await webapp.close();
  await new Promise(resolve => setTimeout(async () => {
    resolve();
    db.end();
  }, 1000)); // avoid jest open handle error
});

// ---------------user---------------------
describe('user', () => {

  it('registers', async() => {
    await request(webapp).post('/api/register').send({name: "integrationtestuser", email:"testuser@gmail.com", password:"Test123123"})
    .expect(201)
    .then((response) => {
      expect(JSON.parse(response.text).id).not.toBeNaN();
    })
  });

  it('fails to register duplicated user', async() => {
    await request(webapp).post('/api/register').send({name: "integrationtestuser", email:"testuser@gmail.com", password:"Test123123"})
    .expect(409)
    .then((response) => {
      expect(JSON.parse(response.text).error).toBe('The user already exists in the database');
    })
    await knex('User').del().where({name: 'testuser'});
  });

  it('fails to register', async() => {
    await request(webapp).post('/api/register').send({name: "integrationtestuser", email:null, password:"Test123123"})
    .expect(404)
    .then((response) => {
      expect(JSON.parse(response.text).error).toBe('missing infomation');
    })});

  it('login', async() => {
    // const testId = await knex.select('id').from('Player').where('name', '=', 'test', 'password', '=', 'Test123123');
    await request(webapp).post('/api/login').send({name: 'integrationtestuser', password: 'Test123123'})
    .expect(201) // testing the response status code
    .then((response) => {
      expect(JSON.parse(response.text).name).toBe('integrationtestuser');
    })});

  it('get a nonexisting user', async() => {
    await request(webapp).get('/api/getUser/nonexist')
    .expect(404) // testing the response status code
  });

  it('delete a user', async() => {
    await request(webapp).delete('/api/deleteUser/integrationtestuser')
    .expect(200) // testing the response status code
    .then((response) => {
      expect(JSON.parse(response.text).message).toBe('integrationtestuser deleted.');
    })});
})




// test('Endpoint status code and response', async () => {
//   const testPost = {
//     creator: 1,
//     corner: 1,
//     type:'post',
//     text:'testforpost',
//     pic: null,
//     audio: null,
//     video: null,
//     isFlagged: 0,
//     isHidden: 0,
//     creatorName: 'creatorname',
//     cornerName:'cornerName',
//   };

//   request(webapp).post('/api/createPost').send(testPost)
//    .expect(200)
//    .then( async (response) => {
//      const res = JSON.parse(response.text).createdpost;
//      expect(res).toHaveProperty('creatorName','creatorname');
//    });
//  });
