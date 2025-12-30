/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      // Pour les images Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Ignorer les erreurs ESLint lors du build (pour le déploiement)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;



