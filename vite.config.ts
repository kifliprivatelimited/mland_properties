import { defineConfig, type Plugin } from 'vite';
// @ts-expect-error importing JavaScript server file
import { handleAdminApi } from './server/adminApi.js';

function adminApiPlugin(): Plugin {
  return {
    name: 'admin-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const handled = await handleAdminApi(req, res);
            if (handled) return;
          } catch (err) {
            console.error('[API Middleware Error]', err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
            }
            return;
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const handled = await handleAdminApi(req, res);
            if (handled) return;
          } catch (err) {
            console.error('[Preview API Middleware Error]', err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
            }
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [adminApiPlugin()],
});
