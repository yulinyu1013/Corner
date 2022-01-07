require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
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

const lib = require('../dbOperations/user_crud');
const db = require('../db-config');

afterAll(async () => {
  await new Promise(resolve => setTimeout(async () => {
    resolve();
    db.end();
  }, 1000)); // avoid jest open handle error
});


describe('User crud queries', () => {
  const uuid = uuidv4();
  const testuser = {
    id: uuid,
    name: 'unitTest',
    email: 'unittest@gmail.com',
    password: '123456789A',
  }

  const testuser2 = {
    id: uuid,
    bio: 'this is bio',
    name: 'unitTest',
    email: 'unittest@gmail.com',
    password: '123456789A',
    avatar: null,
  }

  it('register', async() => {
    await lib.register(db, testuser);
    const user = await knex.select('name').from('User').where('name', '=', 'unitTest');
    expect(user[0].name).toBe('unitTest');
  })


  it('login', async() => {
    const user = await lib.login(db, testuser);
    expect(user.name).toBe('unitTest');
  })

  // it('update a user', async() => {
  //   await lib.updateUser(db, testuser2);
  //   const user = await knex.select('bio').from('User').where('name', '=', 'unitTest');
  //   // console.log(user[0]);
  //   expect(user[0].bio).toBe(testuser2.bio);
  // })

  it('delete a user', async() => {
    await lib.deleteUser(db, testuser.name)
    const user = await knex.select('name').from('User').where('name', '=', 'unitTest');
    expect(user.length).toBe(0);
  })

})