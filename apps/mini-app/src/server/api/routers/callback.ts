import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "@wall-post/prisma";
import { VK } from "vk-io";

function getVkInstance(token: string) {
  return new VK({ token });
}

const vkApiG = async (groupId: string | number) => {
  const token = await prisma.communityToken.findUnique({
    where: { groupId: +groupId },
  });

  if (!token) throw new Error("Токен не найден");

  return getVkInstance(token.token);
};

export const callbackRouter = createTRPCRouter({
  saveGroupToken: publicProcedure
    .input(z.object({ group_id: z.number(), token: z.string() }))
    .mutation(async ({ input }) => {
      // Сохраняем токен группы в БД
      await prisma.communityToken.upsert({
        where: { groupId: input.group_id },
        update: { token: input.token },
        create: { groupId: input.group_id, token: input.token },
      });

      return { success: true };
    }),

  getCallbackServer: publicProcedure
    .input(z.object({ group_id: z.number() }))
    .query(async ({ input }) => {
      const tokenRow = await prisma.communityToken.findUnique({
        where: { groupId: input.group_id },
      });
      if (!tokenRow) throw new Error("Токен не найден");
      const vk = getVkInstance(tokenRow.token);
      const data = await vk.api.groups.getCallbackServers({
        group_id: input.group_id,
      });

      return data;
    }),

  createCallbackServer: publicProcedure
    .input(
      z.object({
        group_id: z.number(),
        url: z.string().url(),
        secret_key: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const tokenRow = await prisma.communityToken.findUnique({
        where: { groupId: input.group_id },
      });
      if (!tokenRow) throw new Error("Токен не найден");
      const vk = getVkInstance(tokenRow.token);

      const data = await vk.api.groups.addCallbackServer({
        group_id: input.group_id,
        url: input.url,
        title: "Wall-Post",
        secret_key: input.secret_key ?? undefined,
      });

      return data;
    }),

  updateCallbackServer: publicProcedure
    .input(
      z.object({
        group_id: z.number(),
        server_id: z.number(),
        events: z.array(z.string()),
        secret_key: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const tokenRow = await prisma.communityToken.findUnique({
        where: { groupId: input.group_id },
      });
      if (!tokenRow) throw new Error("Токен не найден");
      const vk = getVkInstance(tokenRow.token);
      // Формируем events объект
      const eventsObj: Record<string, 1> = {};

      for (const event of input.events) {
        eventsObj[event] = 1;
      }
      const data = await vk.api.groups.setCallbackSettings({
        group_id: input.group_id,
        server_id: input.server_id,
        ...eventsObj,
      });

      return data;
    }),

  setup: publicProcedure
    .input(
      z.object({
        group_id: z.number(),
        secret_key: z.string().optional(),
        server_url: z.string().url(),
        events: z.array(z.string()),
        access_token: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const vk = getVkInstance(input.access_token);
      // 1. Получаем все callback-серверы
      const serversData = await vk.api.groups.getCallbackServers({
        group_id: input.group_id,
      });

      if (serversData?.items) {
        // 2. Удаляем все существующие серверы
        for (const server of serversData.items) {
          await vk.api.groups.deleteCallbackServer({
            group_id: input.group_id,
            server_id: server.id,
          });
        }
      }
      // 3. Создаем новый сервер
      const addServerData = await vk.api.groups.addCallbackServer({
        group_id: input.group_id,
        url: input.server_url,
        title: "Main Callback",
        secret_key: input.secret_key ?? undefined,
      });
      const serverId = addServerData.server_id;

      if (!serverId) {
        throw new Error("Не удалось получить server_id");
      }

      // 4. Настраиваем события
      if (input.events && input.events.length > 0) {
        const eventsObj: Record<string, 1> = {};

        for (const event of input.events) {
          eventsObj[event] = 1;
        }
        await vk.api.groups.setCallbackSettings({
          group_id: input.group_id,
          server_id: serverId,
          ...eventsObj,
        });
      }

      return {
        success: true,
        message: "Callback API успешно настроен",
        server_id: serverId,
      };
    }),

  saveUserToken: publicProcedure
    .input(z.object({ user_id: z.number(), token: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.userToken.upsert({
        where: { userId: input.user_id },
        update: { token: input.token },
        create: { userId: input.user_id, token: input.token },
      });

      return { success: true };
    }),

  getUserToken: publicProcedure
    .input(z.object({ user_id: z.number() }))
    .query(async ({ input }) => {
      const tokenRow = await prisma.userToken.findUnique({
        where: { userId: input.user_id },
      });
      if (!tokenRow) throw new Error("User token not found");

      return { token: tokenRow.token };
    }),
});
