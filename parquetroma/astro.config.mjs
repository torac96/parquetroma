// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://torac96.github.io',
  base: '/parquetroma',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],
  image: {
    remotePatterns: [
      { hostname: 'picsum.photos' },
      { hostname: 'fastly.picsum.photos' },
      { hostname: 'ui-avatars.com' },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
