const dbLib = require('../dbOperations/Notifications_query'); 
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

describe('notification query', () => {
  test('get all notification', async () => {
    const res = await dbLib.getNotifications(db, 'nosuchuser');
    expect(res.length).toBe(0);
  });

  test('get all notification when db close', async () => {
    db.end();
    try {
      await dbLib.getNotifications(db, 'nosuchuser');
    } catch (error) {
      expect(error.message).toBe('Error executing the query');
    }
  });

  test('update notification when db close', async () => {
    db.end();
    try {
      await dbLib.getNotifications(db, 'null', 'null', 'null');
    } catch (error) {
      expect(error.message).toBe('Error executing the query');
    }
  })
})