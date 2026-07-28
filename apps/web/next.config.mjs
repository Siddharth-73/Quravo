import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: false, // Enabled in dev so Push Notifications can be tested locally
  register: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@quravo/common'],
};

export default withPWA(nextConfig);
