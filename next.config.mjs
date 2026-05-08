/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mantener imágenes sin optimización para conservar compatibilidad con las URLs externas existentes.
  images: {
    unoptimized: true,
  },

  // Solo ignorar errores de ESLint/TS en desarrollo rápido, no en producción final.
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV !== 'production',
  },

  // Permite importar SVGs como componentes React.
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
                {
                  name: 'cleanupIDs',
                  active: true,
                },
              ],
            },
          },
        },
      ],
    })
    return config
  },
}

export default nextConfig
