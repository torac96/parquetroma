// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const isNetlify = process.env.DEPLOY_TARGET === 'netlify';

export default defineConfig({
  site: isNetlify ? 'https://parquetroma.it' : 'https://torac96.github.io',
  base: isNetlify ? '/' : '/parquetroma',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        if (item.url.endsWith('/parquetroma/') || item.url.endsWith('/parquetroma')) return { ...item, priority: 1.0 };
        if (item.url.includes('/posa-parquet-roma/')) return { ...item, priority: 0.9 };
        if (item.url.includes('/preventivo-parquet-roma/')) return { ...item, priority: 0.9 };
        if (item.url.includes('/levigatura-parquet-roma/')) return { ...item, priority: 0.85 };
        if (item.url.includes('/parquettista-roma/')) return { ...item, priority: 0.85 };
        if (item.url.includes('/blog/')) return { ...item, priority: 0.6, changefreq: 'weekly' };
        return item;
      },
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
