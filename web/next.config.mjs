export default (phase, { defaultConfig }) => {
  const env = process.env.NODE_ENV;
  /**
   * @type {import("next").NextConfig}
   */
   return {
      async rewrites() {
        return [
          {
            source: "/query",
            destination: "/api/proxy-query"
          }
        ];
      }
    };
  }
