import { PrismaClient } from "./generated/client";

export { PrismaClient };

export const prisma = new PrismaClient();

export * from "./generated/client/";
