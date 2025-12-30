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
  webpack: (config, { isServer }) => {
    // Ignorer le dossier Dashboard lors du watch et du build
    const existingIgnored = config.watchOptions?.ignored;
    let ignoredArray: string[] = [];
    
    if (existingIgnored) {
      if (Array.isArray(existingIgnored)) {
        ignoredArray = existingIgnored.filter((item): item is string => typeof item === 'string' && item.length > 0);
      } else if (typeof existingIgnored === 'string' && existingIgnored.length > 0) {
        ignoredArray = [existingIgnored];
      }
    }
    
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [...ignoredArray, '**/Dashboard/**'],
    };
    return config;
  },
};

export default nextConfig;
