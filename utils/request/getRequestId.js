import { randomUUID } from 'node:crypto';

export const getRequestId = (req) => {
  const headers = ['x-request-id', 'request-id', 'request_id'];

  for (const key of headers) {
    if (req.headers[key]) {
      return req.headers[key];
    }
  }

  if (req.id) {
    return req.id;
  }

  return randomUUID().replaceAll('-', '');
};
