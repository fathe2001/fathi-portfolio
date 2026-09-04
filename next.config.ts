import type { NextConfig } from "next";

// On GitHub Pages the site is served from /<repo-name>, so assets and links
// need a basePath. Locally (npm run dev) it stays at the root.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = "fathi-portfolio";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(isGithubPages
    ? { basePath: `/${repo}`, assetPrefix: `/${repo}/` }
    : {}),
};

export default nextConfig;
