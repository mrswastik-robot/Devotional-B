/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['randomuser.me' , 'source.unsplash.com', 'avatars.githubusercontent.com' , 'turk.net' , 'lh3.googleusercontent.com', 'graph.facebook.com', 'firebasestorage.googleapis.com', 'qph.cf2.quoracdn.net'],
        // unoptimized: true,
    },
    // distDir: 'build',
    // output: 'export',
    // trailingSlash: true,
};

export default nextConfig;
