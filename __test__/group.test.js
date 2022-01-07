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

const lib = require('../dbOperations/group_query');
const db = require('../db-config');


afterAll(async () => {
  await new Promise(resolve => setTimeout(async () => {
    resolve();
    db.end();
  }, 1000)); // avoid jest open handle error
});

describe('group crud queries', () => {

  // const uuid1 = uuidv4();
  // const uuid2 = uuidv4();
  // const testcorner = {
  //   id: uuid1,
  //   name: 'unitTestCorner',
  //   creator: 'test1',
  //   desciption: null,
  //   avatar: null,
  //   chatId: uuid2,
  //   isPublic: 0,
  //   tag: 'tag1|tag2'
  // }

  // const testcorner2 = {
  //   id: uuid1,
  //   name: 'unitTestCorner',
  //   creator: 'test1',
  //   description: 'this is description',
  //   avatar: null,
  //   chatId: uuid2,
  //   isPublic: 0,
  //   tag: 'tag1|tag2'
  // }
  const cornerId = 'unitTestCornerId';
  const user = 'unitTestId1';

  it('get a group', async() => {
    const corner = await lib.fetchAGroup(db, cornerId);
    expect(corner.name).toBe('unitTestCorner');
  })


  // it('get all groups', async() => {
  //   const corners = await lib.fetchAllGroups(db);
  //   const all = await knex.select('id').from('Corner.Corner');
  //   expect(all.length).toBe(corners.length);
  // })

  it('get all groups for a user', async() => {
    const corners = await lib.fetchGroupsForAUser(db, 'unitTestId1')
    const all = await knex.select('user').from('UserInCorner').where('user', '=', user);
    expect(all.length).toBe(corners.length);
  })
})