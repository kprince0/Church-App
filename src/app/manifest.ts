import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '잭슨빌 한인장로교회 앱',
    short_name: 'JKPC',
    description: '잭슨빌 한인장로교회 통합 앱',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e3a8a',
    lang: 'ko',
    icons: [
      {
        src: '/icons/icon-192.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
      {
        src: '/icons/icon-512.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
  };
}
