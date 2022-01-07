import axios from 'axios';
/* eslint-disable import/prefer-default-export */
export const getEngagment = async (cornerId) => axios.get(`https://corner202.herokuapp.com/api/analytics/engagement/${cornerId}`);
export const getPostStats = async (cornerId) => axios.get(`https://corner202.herokuapp.com/api/analytics/post/${cornerId}`);
export const getMemberGrowth = async (cornerId) => axios.get(`https://corner202.herokuapp.com/api/analytics/member/${cornerId}`);
