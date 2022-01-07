const { v4: uuidv4 } = require('uuid');

const getPost = async (db, postId) => {
  const query = `SELECT * FROM Corner.Post WHERE id='${postId}'`;
  try {
    const [row] = await db.promise().execute(query);
    return row[0];
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const getCommentById = async (db, id) => {
  const query = 'SELECT * FROM Corner.Post WHERE id = ?';
  const params = [id];
  const [row] = await db.promise().execute(query, params);
  return row[0];
};

const createPost = async (db, newPost) => {
  await db.promise().execute('SET FOREIGN_KEY_CHECKS=0');
  const uuid = uuidv4();
  const query = `INSERT INTO Corner.Post (id,creator, corner,type, text, pic, audio, video, isFlagged, isHidden, creatorName, cornerName, avatar)
                 VALUES('${uuid}',?,?,?,?,?,?,?,?,?,?,?,?)`;
  const params = [newPost.creator,
    newPost.corner,
    newPost.type,
    newPost.text,
    newPost.pic,
    newPost.audio,
    newPost.video,
    newPost.isFlagged,
    newPost.isHidden,
    newPost.creatorName,
    newPost.cornerName,
    newPost.avatar,
  ];

  try {
    await db.promise().execute(query, params);
    const newpost = await getPost(db, uuid);
    if (newPost.pic !== null) {
      const picArr = newPost.pic.split(',');
      newpost.pic = picArr;
    }
    return newpost;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const getPopularPosts = async (db, page) => {
  const numOfPostsEachPage = 10;
  const query = `SELECT * FROM Corner.Post
                 join Corner.Corner
                 ON Corner.Post.corner = Corner.Corner.id
                 WHERE Corner.Post.type="post" and Corner.Post.isHidden = 0 and Corner.Corner.isPublic = 1
                 ORDER BY Corner.Post.updatedAt DESC LIMIT ?, ?`;
  const startIndex = (page - 1) * numOfPostsEachPage;
  const params = [startIndex.toString(), numOfPostsEachPage.toString()];
  try {
    const [rows] = await db.promise().execute(query, params);
    if (rows === undefined || rows.length === 0) {
      return [];
    }

    const data = rows.map((p) => {
      if (p.pic !== null) {
        const picArr = p.pic.split(',');
        p.pic = picArr;
      }
      return p;
    });
    return data;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const getUserPosts = async (db, userId, page) => {
  const numOfPostsEachPage = 10;
  const query = `select * from Corner.Post
                 join UserInCorner
                 on Post.corner = UserInCorner.corner
                 where UserInCorner.user = ? ORDER BY updatedAt DESC LIMIT ?, ?`;
  const startIndex = (page - 1) * numOfPostsEachPage;
  const params = [userId, startIndex.toString(), numOfPostsEachPage.toString()];

  try {
    const [rows] = await db.promise().execute(query, params);
    if (rows === undefined || rows.length === 0) {
      return [];
    }

    const data = rows.map((p) => {
      if (p.pic !== null) {
        const picArr = p.pic.split(',');
        p.pic = picArr;
      }
      return p;
    });
    console.log(data);
    return data;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const getCornerPosts = async (db, cornerId, page) => {
  const numOfPostsEachPage = 10;
  const query = 'SELECT * FROM Corner.Post WHERE type="post" and corner = ? ORDER BY updatedAt DESC LIMIT ?, ?';
  const startIndex = (page - 1) * numOfPostsEachPage;
  const params = [cornerId, startIndex.toString(), numOfPostsEachPage.toString()];

  try {
    const [rows] = await db.promise().execute(query, params);
    if (rows === undefined || rows.length === 0) {
      return [];
    }

    const data = rows.map((p) => {
      if (p.pic !== null) {
        const picArr = p.pic.split(',');
        p.pic = picArr;
      }
      return p;
    });

    return data;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const updatePost = async (db, postId, updatedTerm, updatedValue) => {
  const query = `UPDATE Corner.Post SET ${updatedTerm} = ${updatedValue} WHERE id=?`;
  const params = [postId];
  try {
    const [row] = await db.promise().execute(query, params);
    if (row.affectedRows === 1) {
      return 'success';
    }
    return 'fail';
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const deletePost = async (db, postId) => {
  const query = 'DELETE FROM Corner.Post WHERE id = ? or pid = ?';
  const params = [postId, postId];
  const [row] = await db.promise().execute(query, params);
  if (row.affectedRows === 1) {
    return 'success';
  }
  return 'no such post';
};

const createComment = async (db, commentBody) => {
  const uuid = uuidv4();
  const query = `INSERT INTO Corner.Post (id,creator, corner,type, pid, text, creatorName, cornerName, avatar)
                 VALUES('${uuid}',?,?,?,?,?,?,?,?)`;
  const params = [commentBody.creator,
    commentBody.corner,
    commentBody.type,
    commentBody.pid,
    commentBody.text,
    commentBody.creatorName,
    commentBody.cornerName,
    commentBody.avatar,
  ];
  console.log(params);

  try {
    await db.promise().execute('SET FOREIGN_KEY_CHECKS=0');
    const [row] = await db.promise().execute(query, params);
    console.log('row', row);
    if (row.affectedRows === 1) {
      const data = await getCommentById(db, uuid);
      return data;
    }
    return null;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const getAllComments = async (db) => {
  const query = 'SELECT * FROM Corner.Post WHERE type="comment"';
  const [rows] = await db.promise().execute(query);
  return rows;
};

const updateComment = async (db, id, newText) => {
  const query = `UPDATE Corner.Post SET text = '${newText}' WHERE id=?`;
  const params = [id];
  try {
    const [row] = await db.promise().execute(query, params);
    if (row.affectedRows === 1) {
      return 'success';
    }
    return 'fail';
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

const getSinglePost = async (db, postId) => {
  const query = 'SELECT * FROM Corner.Post WHERE id = ? or pid = ?';
  const params = [postId, postId];
  try {
    const [rows] = await db.promise().execute(query, params);
    if (rows === undefined || rows.length === 0) {
      return [];
    }
    return rows;
  } catch (err) {
    // console.log(err);
    throw new Error('Error executing the query');
  }
};

module.exports = {
  getPost,
  getCommentById,
  createPost,
  getPopularPosts,
  getUserPosts,
  getCornerPosts,
  updatePost,
  deletePost,
  createComment,
  getAllComments,
  updateComment,
  getSinglePost,
};
