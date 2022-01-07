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

// const user = require('../dbOperations/user_crud');
const lib = require('../dbOperations/user_query');
const db = require('../db-config');

afterAll(async () => {
  await new Promise(resolve => setTimeout(async () => {
    resolve();
    db.end();
  }, 1000)); // avoid jest open handle error
});


describe('User in Corner queries', () => {
  const cornerId = 'unitTestCornerId';
  // const testuser1 = {
  //   id: 'unitTestId1',
  //   name: 'unitTest1',
  //   email: 'unittest1@gmail.com',
  //   password: '123456789A',
  // }

  // const testuser2 = {
  //   id: 'unitTestId2',
  //   name: 'unitTest2',
  //   email: 'unittest2@gmail.com',
  //   password: '123456789A',
  // }

  // const testuser3 = {
  //   id: 'unitTestId3',
  //   name: 'unitTest3',
  //   email: 'unittest3@gmail.com',
  //   password: '123456789A',
  // }

  // const testuser4 = {
  //   id: 'unitTestId4',
  //   name: 'unitTest4',
  //   email: 'unittest4@gmail.com',
  //   password: '123456789A',
  // }

  // const testuser5 = {
  //   id: 'unitTestId5',
  //   name: 'unitTest5',
  //   email: 'unittest5@gmail.com',
  //   password: '123456789A',
  // }

  it('get all members from a corner', async() => {
    const res = await lib.fetchMemberList(db, cornerId);
    const res2 = await knex.select('user').from('UserInCorner').where('corner', '=', cornerId);
    expect(res.length).toBe(res2.length);

  })

  it('get all admins', async()=>{
    const res = await lib.getAdminsOfCorner(db, cornerId);
    const res2 = await knex.select('user').from('UserInCorner')
    .where('corner', '=', cornerId)
    .where('level', '>', 1);
    expect(res.length).toBe(res2.length);
  })

  it('get all users', async()=>{
    const res = await lib.getAllUsers(db)
    const res2 = await knex.select('id').from('User')
    expect(res.length).toBe(res2.length);
  })

  it('get user level', async()=>{
    const res = await lib.getUserLevel(db, 'unitTestId1', cornerId);
    const res2 = await knex.select('level').from('UserInCorner')
    .where('corner', '=', cornerId)
    .where('user', '=', 'unitTestId1');
    expect(res.level).toBe(res2[0].level);
  })


  it('update user level', async()=>{
    await lib.updateUserLevel(db, 'unitTestId1', cornerId, 2);
    const res2 = await knex.select('level').from('UserInCorner')
    .where('corner', '=', cornerId)
    .where('user', '=', 'unitTestId1');
    expect(res2[0].level).toBe(2);
  })

  it('get user from corner', async()=>{
    const res = await lib.getUserFromCorner(db, cornerId, 'unitTestId1');
    expect(res).toBe(true);
    const res2 = await lib.getUserFromCorner(db, cornerId, 'test2name');
    expect(res2).toBe(false);
  })

  it('check admin', async()=>{
    const res = await lib.checkAdmin(db, cornerId, 'unitTestId1');
    expect(res).toBe(true);

    const res2 = await lib.checkAdmin(db, cornerId, 'unitTestId2');
    expect(res2).toBe(false);
  })

  it('get user id', async() =>{
    const res = await lib.getUserId(db, 'unitTest1');
    expect(res.id).toBe('unitTestId1');
  })
})



