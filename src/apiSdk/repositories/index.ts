import axios from 'axios';
import queryString from 'query-string';
import { RepositoryInterface, RepositoryGetQueryInterface } from 'interfaces/repository';
import { GetQueryInterface } from '../../interfaces';

export const getRepositories = async (query?: RepositoryGetQueryInterface) => {
  const response = await axios.get(`/api/repositories${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRepository = async (repository: RepositoryInterface) => {
  const response = await axios.post('/api/repositories', repository);
  return response.data;
};

export const updateRepositoryById = async (id: string, repository: RepositoryInterface) => {
  const response = await axios.put(`/api/repositories/${id}`, repository);
  return response.data;
};

export const getRepositoryById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/repositories/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRepositoryById = async (id: string) => {
  const response = await axios.delete(`/api/repositories/${id}`);
  return response.data;
};
