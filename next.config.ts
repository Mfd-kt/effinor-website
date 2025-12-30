import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Pour les images Supabase Storage (à ajouter si vous utilisez Supabase Storage)
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Exclure le Dashboard du build (c'est une application séparée)
  // Note: Le Dashboard est déjà exclu via .vercelignore
  // Configuration Turbopack pour Next.js 16 (utilisé par défaut sur Vercel)
  turbopack: {},
};

export default nextConfig;
