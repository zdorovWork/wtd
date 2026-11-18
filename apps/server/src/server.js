// Checked in so Vercel can resolve the Nest entrypoint before `pnpm bundle`.
// On Vercel that command overwrites this file with the bundled server.
require("@nestjs/core");
require("../dist/server.js");
