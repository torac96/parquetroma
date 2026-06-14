// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.parquetroma.it',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],
  image: {
    remotePatterns: [{ hostname: 'picsum.photos' }, { hostname: 'ui-avatars.com' }],
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            gsap: ['gsap'],
          },
        },
      },
    },
  },
});
