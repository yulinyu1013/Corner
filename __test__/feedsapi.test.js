const dbLib = require('../dbOperations/feedsApi'); 
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

describe('feeds operations tests', () => {
  const testPost = {
    creator: 'test1',
    corner: 1,
    type:'post',
    text:'unittestforpost',
    pic: null,
    audio: null,
    video: null,
    isFlagged: 0,
    isHidden: 0,
    creatorName: 'test1',
    cornerName:'cornerName',
    avatar: null,
  };

  test('inserts and get a new post', async () => {
    await dbLib.createPost(db, testPost);
    const newPost = await knex.select('text').from('Post').where('creator', '=', 'test1');
    expect(newPost[0].text).toBe('unittestforpost');

    // const newPostId = await knex.select('id').from('Post').where('creator', '=', 'test1');
    // const id = newPostId[0].id;

    // const res = dbLib.getSinglePost(db, id);
    // expect(res.length).toBeGreaterThanOrEqual(0);
  });

  test('inserts a new post when db closed', async () => {
    db.end();
    try {
      await dbLib.createPost(db, testPost);
    } catch (error) {
      expect(error.message).toBe('Pool is closed.');
    }
  });

  test('get popular post', async () => {
    const data = await dbLib.getPopularPosts(db, 1);
    expect(data.length).toBeLessThanOrEqual(10);
  });

  test('getUserPosts with wrong id', async () => {
    const data = await dbLib.getUserPosts(db, 'nosuchuser', 1);
    expect(data.length).toBe(0);
  });

  test('getUserPosts with wrong id', async () => {
    const data = await dbLib.getUserPosts(db, 'test1', 1);
    expect(data.length).toBeLessThanOrEqual(10);
  });

  test('getcornerPost with wrong id', async () => {
    const data = await dbLib.getUserPosts(db, 'nosuchcorner', 1);
    expect(data.length).toBe(0);
  });

  test('get single post with wrong id', async () => {
    const res = await dbLib.getSinglePost(db, 'nosuchpost');
    console.log(res);
    expect(res.length).toBe(0);
  })

  // no delete and update
  // need to add if coverage is low

});

describe('comment operation', () => {
  const testComment = {
    creator: 'test1',
    corner: 1,
    type:'post',
    text:'unittestforcomment',
    pid: '1',
    pic: null,
    audio: null,
    video: null,
    isFlagged: 0,
    isHidden: 0,
    creatorName: 'test1',
    cornerName:'cornerName',
    avatar: null,
  };

  // this may cause issue bc pid is mocked -- it has foreign key constraints
  test('create comment', async () => {
    await dbLib.createComment(db, testComment);
    const newPost = await knex.select('text').from('Post').where('text', '=', 'unittestforcomment');
    expect(newPost[0].text).toBe('unittestforcomment');
  });

  test('getAllComments', async () => {
    const res = await dbLib.getAllComments(db);
    expect(res.length).toBeGreaterThanOrEqual(0);
  });
})
