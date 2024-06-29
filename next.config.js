// @ts-check
 
/** @type {import('next').NextConfig} */
const path = require('path')
 
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['picsum.photos','images.unsplash.com','images.pexels.com'], 
  },
};
 
module.exports = nextConfig