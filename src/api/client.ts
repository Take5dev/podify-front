import axios, {CreateAxiosDefaults} from 'axios';

import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';

// const client = axios.create({baseURL: 'https://podify-server-2c658ffbb41f.herokuapp.com'});

const baseURL = 'https://podify-server-2c658ffbb41f.herokuapp.com';

type Headers = CreateAxiosDefaults<any>['headers'];

export const getClient = async (headers?: Headers) => {
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

  if (!token) {
    return axios.create({baseURL, headers});
  }

  const combinedHeaders = {
    Authorization: `Bearer ${token}`,
    ...headers,
  };

  return axios.create({baseURL, headers: combinedHeaders});
};

// export default client;
