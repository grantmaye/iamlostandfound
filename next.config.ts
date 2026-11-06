import type { NextConfig } from "next";
const config: NextConfig = {
  turbopack: { root: process.cwd() },
  devIndicators: false,
  trailingSlash: true,
};
export default config;
