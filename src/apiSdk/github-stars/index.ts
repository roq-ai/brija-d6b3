import axios from 'axios';
import queryString from 'query-string';
import { GithubStarInterface, GithubStarGetQueryInterface } from 'interfaces/github-star';
import { GetQueryInterface } from '../../interfaces';

export const getGithubStars = async (query?: GithubStarGetQueryInterface) => {
  const response = await axios.get(`/api/github-stars${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGithubStar = async (githubStar: GithubStarInterface) => {
  const response = await axios.post('/api/github-stars', githubStar);
  return response.data;
};

export const updateGithubStarById = async (id: string, githubStar: GithubStarInterface) => {
  const response = await axios.put(`/api/github-stars/${id}`, githubStar);
  return response.data;
};

export const getGithubStarById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/github-stars/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGithubStarById = async (id: string) => {
  const response = await axios.delete(`/api/github-stars/${id}`);
  return response.data;
};
