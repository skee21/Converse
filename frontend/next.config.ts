import type { NextConfig } from "next";
import { RemovePolyfillPlugin } from "./lib/RemovePolyfillPlugin";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*"],
  experimental: {
    inlineCss: true,
  },
  webpack(config, { isServer }) {
    const fileLoaderRule = config.module.rules.find(
      (rule: { test?: { test?: (str: string) => boolean } }) =>
        rule.test?.test?.(".svg")
    );

    if (fileLoaderRule) {
      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [/url/] },
          use: ["@svgr/webpack"],
        }
      );

      fileLoaderRule.exclude = /\.svg$/i;
    }

    if (!isServer) {
      config.plugins.push(new RemovePolyfillPlugin());
    }

    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
