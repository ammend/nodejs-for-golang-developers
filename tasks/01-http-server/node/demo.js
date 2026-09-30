// 演示辅助：启动真实 HTTP 服务、请求路由、打印响应，然后关闭。
import { createServer } from 'node:http';
import { once } from 'node:events';

export async function demonstrate(handler, paths) {
  const server = createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    for (const path of paths) {
      const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`);
      console.log(`GET ${path} → ${response.status} ${(await response.text()).trim()}`);
    }
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
