/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pages Router only — no `app/` directory is used in this project.
  sassOptions: {
    includePaths: ['./styles'],
    prependData: `@import "variables.scss"; @import "mixins.scss";`,
  },
  env: {
    NEXT_PUBLIC_APP_TIMEZONE: 'Asia/Kuala_Lumpur',
  },
};

module.exports = nextConfig;
