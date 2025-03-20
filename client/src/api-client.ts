import createClient from 'openapi-fetch';
import type { paths } from './api.types';

const { GET, POST, PUT, DELETE } = createClient<paths>({ baseUrl: 'https://localhost:4001' });

GET('/tasks', { query: { completed: true } });

POST('/tasks', {
  body: {
    title: 'New Task',
    description: 'WOwo',
  },
});
