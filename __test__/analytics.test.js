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

const lib = require('../dbOperations/analytics');
const db = require('../db-config');

afterAll(async () => {
  await new Promise(resolve => setTimeout(async () => {
    resolve();
    db.end();
  }, 1000)); // avoid jest open handle error
});


describe('Analytics queries', () => {

  const cornerId = 'unitTestCornerId';
  
  it('get post stats', async() => {
    const res = await lib.getPostStats(db, cornerId);
    console.log(res);
    const pic = await knex.select('id').from('Corner.Post').where('corner','=',cornerId).whereNotNull('pic');
    const audio = await knex.select('id').from('Corner.Post').where('corner','=',cornerId).whereNotNull('audio');
    const video = await knex.select('id').from('Corner.Post').where('corner','=',cornerId).whereNotNull('video');
    const text = await knex.select('id').from('Corner.Post')
    .where('corner','=',cornerId).whereNull('video')
    .where('corner','=',cornerId).whereNull('audio')
    .where('corner','=',cornerId).whereNull('pic');
    expect(pic.length).toBe(Number(res.Image));
    expect(audio.length).toBe(Number(res.Audio));
    expect(video.length).toBe(Number(res.Video));
    // expect(text.length).toBe(Number(res.Text));
  })


  it('get member growth', async() => {
    const res = await lib.getMemberGrowth(db, cornerId);
    expect(res.length).toBe(1);
  })



  it('get engagement', async() => {
    const res = await lib.getEngagement(db, cornerId);
    expect(Number(res.Post)).toBeGreaterThanOrEqual(0);
    expect(Number(res.Message)).toBeGreaterThanOrEqual(0);
    expect(Number(res.Comment)).toBeGreaterThanOrEqual(0);
  })
})