import { Application } from "oak/mod.ts";
import { oakCors } from "cors/mod.ts";
import { config } from "dotenv/mod.ts";
import { errorHandler } from "./middlewares/error-handler.ts";
import wordChainRouter from "./routes/word-chain.router.ts";
import { logger } from "./middlewares/logger.ts";

const env = config();
const APP_PORT = parseInt(env.PORT) || 8000;

const app = new Application();

app.use(errorHandler);
app.use(logger);
app.use(oakCors());

app.use(wordChainRouter.routes());
app.use(wordChainRouter.allowedMethods());

console.log(`Server is running on http://localhost:${APP_PORT}`);
await app.listen({ port: APP_PORT });
