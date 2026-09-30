import { demonstrate } from './demo.js';

function handler(request, response) {
  const path = new URL(request.url, 'http://localhost').pathname;
  const user = path.match(/^\/users\/([^/]+)$/);
  let status = 200;
  let body;

  if (request.method === 'GET' && path === '/hello') {
    body = { message: 'hello' };
  } else if (request.method === 'GET' && user) {
    body = { id: decodeURIComponent(user[1]) };
  } else {
    status = 404;
    body = { error: 'not found' };
  }
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

await demonstrate(handler, ['/hello', '/users/42', '/missing']);
