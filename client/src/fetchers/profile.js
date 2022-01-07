import axios from 'axios';

/**
 * Get user profile
 */
export const getUser = async (userId) => axios.delete(`https://corner202.herokuapp.com/api/getUser/${userId}`);

/**
 * Delete user
 */
export const deleteUser = async (username) => axios.delete(`https://corner202.herokuapp.com/api/deleteUser/${username}`);

/**
 * Update user profile
 */
export const updateProfile = async (user) => {
  console.log('fetching updated profile...');
  // console.log(user);
  console.log(user.bio);
  const url = 'https://corner202.herokuapp.com/api/updateUser';
  const myform = new FormData();
  myform.append('id', user.id);
  myform.append('name', user.name);
  myform.append('email', user.email);
  myform.append('password', user.password);
  myform.append('bio', user.bio);
  myform.append('avatar', user.avatar);
  // eslint-disable-next-line
  for (const [name, value] of myform) {
    console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
  }

  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data',
    },
  };

  const res = await axios.put(url, myform, config);
  return res;
};
