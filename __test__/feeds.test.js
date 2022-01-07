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

const lib = require('../dbOperations/feedsApi');
const db = require('../db-config');

const cornerId = 'unitTestCornerId';
const user = 'unitTestId1';

describe('Feeds queries', () => {
  const testPost = {
    creator: user,
    corner: cornerId,
    type: 'post',
    text: 'unit test post',
    pic: null,
    audio: null,
    video: null,
    isFlagged: 0,
    isHidden: 0,
    creatorName: 'unitTest1',
    cornerName: 'unitTestCorner',
    avatar: null,
  }

  it('create post', async() => {
    const res = await lib.createPost(db, testPost);
    expect(res.text).toBe(testPost.text);
  })

  it('get posts by a user', async() => {
    const res = await lib.createPost(db, testPost);
    expect(res.text).toBe(testPost.text);
  })

  it('get post by id', async() => {
    const res = await lib.getPost(db, 'unitTestPostId1');
    expect(res.text).toBe(testPost.text);
  })

  it('get comment by id', async() => {
    const res = await lib.getCommentById(db, 'unitTestPostCommentId1');
    expect(res.text).toBe('unit test post comment');
  })

  it('get a single post id', async() => {
    const res = await lib.getSinglePost(db, 'unitTestPostId1');
    // console.log(res);
    const res2 = await knex.select('id').from('Corner.Post')
    .where('id', '=', 'unitTestPostId1')
    .orWhere('pid', '=', 'unitTestPostId1')
    expect(res.length).toBe(res2.length);
  })

  it('get popular posts', async() => {
    const res = await lib.getPopularPosts(db,1)
    expect(res.length).toBe(10);
  })

  it('get corner posts', async() => {
    const res = await lib.getCornerPosts(db, cornerId, 1);
    expect(res.length).toBeLessThanOrEqual(10);
  })

  it('get all comments', async() => {
    const res = await lib.getAllComments(db);
    const res2 = await knex.select('id').from('Corner.Post').where('type', '=', 'comment')
    expect(res.length).toBeLessThanOrEqual(res2.length);
  })

  test('get single post with wrong id', async () => {
    const res = await lib.getSinglePost(db, 'nosuchpost');
    console.log(res);
    expect(res.length).toBe(0);
  })


  test('delete post with wrong id', async () => {
    const res = await lib.deletePost(db, 'nosuchpost');
    expect(res).toBe('no such post');
  })
})