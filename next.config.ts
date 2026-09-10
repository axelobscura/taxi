import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `src/lib/db/index.ts` reads schema.sql at runtime through a path built from
  // `process.cwd()`, which the file tracer cannot follow statically. Without
  // this the deployed function bundle omits the file and every DB call throws.
  outputFileTracingIncludes: {
    "/*": ["src/lib/db/schema.sql"],
  },
};

export default nextConfig;
