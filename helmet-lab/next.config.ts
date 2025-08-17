import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			"konva/lib/index-node.js": "konva/lib/index.js",
		};
		return config;
	},
};

export default nextConfig;
