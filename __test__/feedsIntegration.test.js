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
    await knex('Post').where('creatorName', 'creatorname').del();
    await knex('Post').where('creatorName', 'commentCreator').del();
    db.end();
  }, 10000)); // avoid jest open handle error
});


describe('create post', () => {
  const testPost = {
    creator: 1,
    corner: 1,
    type:'post',
    text:'testforpost',
    pic: null,
    audio: null,
    video: null,
    isFlagged: 0,
    isHidden: 0,
    creatorName: 'creatorname',
    cornerName:'cornerName',
    avatar: null,
  };

  const errorPost = {
    creator: null,
    corner: 1,
    type:'post',
    text:'testforpost',
    pic: null,
    audio: null,
    video: null,
    isFlagged: 0,
    isHidden: 0,
    creatorName: 'creatorname',
    cornerName:'cornerName',
    avatar: null,
  };

  test('post creation success, then update and delete', async () => {
    request(webapp).post('/api/createPost').send(testPost)
     .expect(200)
     .then( async (response) => {
       const res = JSON.parse(response.text).createdpost;
       expect(res).toHaveProperty('creatorName','creatorname');
       const newPost = await knex.select('id').from('Post').where('creatorName', 'creatorname');
       const idcreated = newPost[0].id;

       await request(webapp).get(`/api/getPost/${idcreated}`)
       .expect(200)
       .then((response1) => {
         expect(JSON.parse(response1.text).length).toBe(1);
       })

       await request(webapp).put(`/api/updatePost/${idcreated}`).send({ isFlagged: 1 })
       .expect(200);

       await request(webapp).delete(`/api/deletePost/${idcreated}`)
       .expect(200);
     });
   });

  test('post creation fail', async () => {
    await request(webapp).post('/api/createPost').send(errorPost)
    .expect(404);
  });

  test('delete post fail', async () => {
    await request(webapp).delete("/api/deletePost/111")
    .expect(404);
  });

  test('update post fail', async () => {
    await request(webapp).put("/api/updatePost/111")
    .expect(404);
  });
});

describe('get post', () => {
  test('get popular post success', async () => {
    await request(webapp).get("/api/getPopularPosts/1")
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text).length).toBeLessThanOrEqual(10);
    });
  });

  test('get getUserPosts post fail', async () => {
    await request(webapp).get("/api/getUserPosts/1/1")
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text).length).toBe(0);
    });
  });

  test('get getCornerPosts post fail', async () => {
    await request(webapp).get("/api/getCornerPosts/0/1")
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text).length).toBe(0);
    });
  });
});

describe('comment', () => {
  const testComment = {
    creator: 'test1',
    corner: 1,
    type:'comment',
    text:'testforcomment',
    pid: 1,
    pic: null,
    audio: null,
    video: null,
    isFlagged: 0,
    isHidden: 0,
    creatorName: 'commentCreator',
    cornerName:'cornerName',
    avatar: null,
  };

  test('post Comment then update and delete', async() => {
    await request(webapp).post('/api/createComment').send(testComment)
    .expect(200)
    .then(async (response) => {
      const res = JSON.parse(response.text);
      expect(res).toHaveProperty('creatorName','commentCreator');

      const newComment = await knex.select('id').from('Post').where('creatorName', 'commentCreator');
      const idcreated = newComment[0].id;

      await request(webapp).put(`/api/updateComment/${idcreated}`).send('i am new')
      .expect(200);
    })
  })
});

describe('get Comments', () => {
  test('get all comments', async () => {
    await request(webapp).get("/api/getComments")
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text).length).toBeGreaterThanOrEqual(0);
    });
  });
});



