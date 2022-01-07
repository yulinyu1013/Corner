const { v4: uuidv4 } = require('uuid');

const login = async (db, user) => {
  // console.log(user);
  const query = `SELECT * FROM Corner.User 
                WHERE name = ? AND password = ?`;
  const params = [user.name, user.password];
  try {
    const row = await db.promise().execute(query, params);
    console.log(row[0][0]);
    return row[0][0];
  } catch (err) {
    console.log(err);
    throw new Error(`Error executing the query, ${err}`);
  }
};

const register = async (db, newUser) => {
  const uuid = uuidv4();
  const query = `INSERT INTO Corner.User (id, name, email, password)
                VALUES(?,?,?,?)`;
  const params = [uuid, newUser.name, newUser.email, newUser.password];
  try {
    await db.promise().execute(query, params);
    const res = await login(db, newUser);
    return res;
  } catch (err) {
    console.log(err);
    throw new Error(`Error executing the query, ${err}`);
  }
};

const getUser = async (db, userId) => {
  const query = 'SELECT id, name, bio, avatar FROM Corner.User WHERE id = ?';
  const params = [userId];
  try {
    const [row] = await db.promise().execute(query, params);
    if (row && row.length === 1) {
      return row[0][0];
    }
    return 'fail';
  } catch (err) {
    throw new Error(`Error executing the query: ${err.message}`);
  }
};

const updateUser = async (db, user) => {
  console.log('user', user);
  const query = 'UPDATE Corner.User SET name=?, bio=?, email=?, password=?, avatar=? WHERE id=?';
  const params = [user.name, user.bio, user.email, user.password, user.avatar, user.id];
  try {
    const [row] = await db.promise().execute(query, params);
    console.log(row);
    const res = await login(db, user);
    return res;
  } catch (err) {
    throw new Error(`Error executing the query: ${err.message}`);
  }
};

const deleteUser = async (db, username) => {
  try {
    const query = 'DELETE FROM Corner.User WHERE name = ?';
    const params = [username];
    const [row] = await db.promise().execute(query, params);
    console.log(row.affectedRows);
    return row.affectedRows; // number of records deleted
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error('Error executing the query');
  }
};

module.exports = {
  login,
  register,
  deleteUser,
  getUser,
  updateUser,
};
