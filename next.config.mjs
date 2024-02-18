/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['randomuser.me' , 'source.unsplash.com', 'avatars.githubusercontent.com' , 'turk.net'],
        // unoptimized: true,
    },
    // distDir: 'build',
    // output: 'export',
    // trailingSlash: true,
};

export default nextConfig;
