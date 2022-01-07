import axios from 'axios';

// const domain = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

/**
 * Post api /createPost
 */
export const createPost = async (
  creator,
  creatorName,
  corner,
  cornerName,
  text,
  pic,
  video,
  audio,
  avatar,
) => {
  const url = 'https://corner202.herokuapp.com/api/createPost';
  const myform = new FormData();
  if (pic === null || pic.length === 0) {
    pic = null;
  } else {
    for (let i = 0; i < pic.length; i += 1) {
      myform.append('pic', pic[i]);
    }
  }
  myform.append('creator', creator);
  myform.append('creatorName', creatorName);
  myform.append('corner', corner);
  myform.append('cornerName', cornerName);
  myform.append('type', 'post');
  myform.append('text', text);
  myform.append('audio', audio);
  myform.append('video', video);
  myform.append('isFlagged', 0);
  myform.append('isHidden', 0);
  myform.append('avatar', avatar);

  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data',
    },
  };

  const res = await axios.post(url, myform, config);
  console.log(res);
  return res;
};

/**
 * get popular posts from backend -- sort by time -- get 10 posts everytime
 * parameters: page N from backend -- meaning N*10 posts
 */
export const getPopularPosts = async (page) => {
  const url = `https://corner202.herokuapp.com/api/getPopularPosts/${page}`;
  const { data } = await axios.get(url);
  return data;
};

/**
 * get corner posts from backend -- select by cornerId
 * parameters: page N from backend -- meaning N*10 posts
 * cornerId
 */
export const getCornerPosts = async (cornerId, page) => {
  const url = `https://corner202.herokuapp.com/api/getCornerPosts/${cornerId}/${page}`;
  const { data } = await axios.get(url);
  console.log(data);
  return data;
};

/**
 * get posts for this user? -- select by user joined corner ids
 * parameters: page N from backend -- meaning N*10 posts
 * cornerId
 */
export const getUserPosts = async (userId, page) => {
  const url = `https://corner202.herokuapp.com/api/getUserPosts/${userId}/${page}`;
  const { data } = await axios.get(url);
  return data;
};

/**
 * update post -- flagged/unflagged -- hide/unhide
 */
export const updatePost = async (postId, updatedContent) => {
  const url = `https://corner202.herokuapp.com/api/updatePost/${postId}`;

  const body = updatedContent;
  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };
  await axios.put(url, body, config);
};

/**
 * delete post
 */
export const deletePost = async (postId) => {
  const url = `https://corner202.herokuapp.com/api/deletePost/${postId}`;
  await axios.delete(url);
};

/**
 * get all comments
 */
export const getAllComments = async () => {
  const url = 'https://corner202.herokuapp.com/api/getComments';
  const { data } = await axios.get(url);
  return data;
};

/**
 * post comment -- create a comment
 */
export const createComment = async (
  creator,
  creatorName,
  corner,
  cornerName,
  text,
  pid,
  avatar,
) => {
  const url = 'https://corner202.herokuapp.com/api/createComment';
  const body = {
    creator,
    creatorName,
    corner,
    cornerName,
    text,
    pid,
    type: 'comment',
    avatar,
  };

  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };
  const { data } = await axios.post(url, body, config);
  return data;
};

/**
 * update comment
 */
export const updateComment = async (commentId, newText) => {
  const url = `https://corner202.herokuapp.com/api/updateComment/${commentId}`;
  const body = { newText };

  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };
  const { data } = await axios.put(url, body, config);
  return data;
};

export const getPostAndItsComments = async (postId) => {
  const url = `https://corner202.herokuapp.com/api/getPost/${postId}`;
  const { data } = await axios.get(url);
  console.log(data);
  return data;
};

export default {
  createPost,
  getPopularPosts,
  getUserPosts,
  updatePost,
  deletePost,
  createComment,
  getAllComments,
  updateComment,
  getPostAndItsComments,
};
