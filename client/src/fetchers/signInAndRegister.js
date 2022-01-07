import axios from 'axios';

export const register = async (user) => axios.post('https://corner202.herokuapp.com/api/register', user);
export const login = async (user) => axios.post('https://corner202.herokuapp.com/api/login', user);
