import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:5000';
/* eslint-disable import/prefer-default-export */
export const createGroup = async (group) => axios.post('https://corner202.herokuapp.com/api/createGroup', group);
