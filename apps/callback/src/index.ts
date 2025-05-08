import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/generated/client/index.js";

const app = new Hono();
const prisma = new PrismaClient();

app.get("/", async (c) => {
  const user = await prisma.user.findMany();
  console.log(user);
  return c.text("Hello Hono!");
});

app.get("/users", async (c) => {
  try {
    const users = await prisma.user.findMany();
    return c.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

serve(
  {
    fetch: app.fetch,
    port: +process.env.CALLBACK_PORT!,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
