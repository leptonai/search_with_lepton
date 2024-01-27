export default (phase, { defaultConfig }) => {
  const env = process.env.NODE_ENV;
  /**
   * @type {import("next").NextConfig}
   */
  if (env === "production") {
    return {
      output: "export",
      assetPrefix: "/ui/",
      basePath: "/ui",
      distDir: "../ui"
    };
  } else {
    return {
      async rewrites() {
        return [
          {
            source: "/query",
            // destination: "http://api.sciphi.ai/query" 
            // destination: "http://127.0.0.1:8080/query"
            destination: "/api/proxy-query" // Redirect to the new API route
            
          }
        ];
      }
    };
  }
}