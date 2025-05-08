import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { callbackRouter } from "@callback/callbackModule/callbackRouter.js";
import { logger } from "hono/logger";

const app = new Hono();

app.route("/callback", callbackRouter);

app.use(logger());

serve(
  {
    fetch: app.fetch,
    port: +process.env.CALLBACK_PORT!,
  },
  (info) => {
    console.info(`Callback server запущен на http://localhost:${info.port}`);
  },
);
