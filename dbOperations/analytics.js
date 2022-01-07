// engagement
const getEngagement = async (db, cornerId) => {
  const query1 = 'SELECT COUNT(*) Message FROM Corner.Message WHERE corner = ?';
  const query2 = 'SELECT SUM(IF(pid IS NULL, 1, 0)) AS Post, SUM(IF(pid IS NULL, 0, 1)) AS Comment FROM Corner.Post WHERE corner = ?';
  try {
    const res1 = await db.promise().execute(query1, [cornerId]);
    const res2 = await db.promise().execute(query2, [cornerId]);
    const res = { ...res1[0][0], ...res2[0][0] };
    return res;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// post by type
const getPostStats = async (db, cornerId) => {
  const query = `SELECT SUM(IF(pic IS NOT NULL, 1, 0)) Image,
                  SUM(IF(audio IS NOT NULL, 1, 0)) Audio,
                  SUM(IF(video IS NOT NULL, 1, 0)) Video,
                  SUM(IF(video IS NULL AND audio IS NULL AND pic IS NULL, 1, 0)) Text
                  FROM Corner.Post 
                  WHERE corner = ?`;
  try {
    const res = await db.promise().execute(query, [cornerId]);
    return res[0][0];
  } catch (err) {
    // console.log(`error: ${err.message}`);
    throw new Error('Error executing the query');
  }
};

//member growth
const getMemberGrowth = async (db, cornerId) => {
  const query = `select DATE_FORMAT(joinAt, '%Y-%m') date , COUNT(*) count FROM Corner.UserInCorner
                  WHERE corner = ? GROUP BY DATE_FORMAT(joinAt, '%Y-%m')
                  ORDER BY date DESC LIMIT 6;`;
  try {
    const [res] = await db.promise().execute(query, [cornerId]);
    // console.log(res);
    return res;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    throw new Error('Error executing the query');
  }
};

module.exports = { getEngagement, getPostStats, getMemberGrowth };
