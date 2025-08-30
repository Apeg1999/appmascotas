import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/catfact-api': {
        target: 'https://catfact.ninja',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/catfact-api/, '/fact'),
      },
      '/deepl-proxy': {
        target: 'https://api-free.deepl.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/deepl-proxy/, '/v2/translate'),
        headers: {
          'Authorization': 'DeepL-Auth-Key f4b8327f-a345-4712-96ba-27038e19c4ae:fx'
        },
      },
    }
  }
});
