// The added "@type" comment will enable TypeScript type information via VSCode, etc.

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
    examples: { url: '/examples'}
  },
  plugins: [
    '@snowpack/plugin-typescript'
  ],
  buildOptions: {
    baseUrl: '/threejs',
    out: './docs',
  },
};