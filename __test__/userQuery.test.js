const dbLib = require('../dbOperations/user_query'); 
const mysql = require('mysql2');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'database-1.c1o1vrjh3mlc.us-east-1.rds.amazonaws.com',
    port : 3306,
    user: 'admin',
    password: 'cis557corner',
    database: 'Corner',
  }
});

jest.setTimeout(30000);

let db;
// cleanup the database after each test
const clearDatabase = async () => {
  await knex('Post').where('text', 'unittestforpost').del();
  await knex('Post').where('text', 'unittestforcomment').del();
};

beforeEach(() => {
  const conn = mysql.createPool({
    host: 'database-1.c1o1vrjh3mlc.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'cis557corner',
    database: 'Corner',
    waitForConnections: true,
  });
  db = conn;
})

afterAll(async () => {
  await clearDatabase();
  db.end();
});

test('get all users', async () => {

})

test('getAdminsOfCorner', async () => {

})

test('addUserIntoCorner when db close', async () => {

})

test('removeUserFromCorner', async () => {

})

test('checkAdmin when db close', async () => {
  
})