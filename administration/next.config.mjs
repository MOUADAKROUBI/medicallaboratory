/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        ppr: 'incremental'
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                pathname: "**",
            },
            {
                protocol: 'https',
                hostname: 'liluttyveugvmguyldwx.supabase.co',
                pathname: '**'
            }
        ]
    }
};

export default nextConfig;
