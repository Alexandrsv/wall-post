import { Hono } from "hono";
import { callbackController } from "@callback/callbackModule/callbackController.js";

export const callbackRouter = new Hono();

callbackRouter.post("/", async (c) => {
  const body = await c.req.json();
  const response = callbackController(body);

  return c.text(response);
});
