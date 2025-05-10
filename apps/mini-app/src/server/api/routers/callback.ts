import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getCallbackServers,
  deleteCallbackServer,
  addCallbackServer,
  setCallbackSettings,
} from "~/utils/vk";

// In-memory хранилище токенов (замени на БД в реальном проекте)
const groupTokens: Record<string, string> = {};

export const callbackRouter = createTRPCRouter({
  saveGroupToken: publicProcedure
    .input(z.object({ group_id: z.number(), token: z.string() }))
    .mutation(async ({ input }) => {
      groupTokens[input.group_id] = input.token;

      return { success: true };
    }),

  getCallbackServer: publicProcedure
    .input(z.object({ group_id: z.number() }))
    .query(async ({ input }) => {
      const token = groupTokens[input.group_id];
      if (!token) throw new Error("Токен не найден");

      return getCallbackServers(input.group_id, token);
    }),

  createCallbackServer: publicProcedure
    .input(
      z.object({
        group_id: z.number(),
        url: z.string().url(),
        secret_key: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const token = groupTokens[input.group_id];
      if (!token) throw new Error("Токен не найден");

      return addCallbackServer(
        input.group_id,
        input.url,
        input.secret_key,
        token,
      );
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
      const token = groupTokens[input.group_id];
      if (!token) throw new Error("Токен не найден");

      // Сначала обновим секретный ключ, если нужно (VK API не поддерживает отдельный update, только через addCallbackServer)
      // Поэтому если нужен update секрета — надо пересоздать сервер
      // Здесь только события:
      return setCallbackSettings(
        input.group_id,
        input.server_id,
        input.events,
        token,
      );
    }),

  // Старый setup для совместимости (можно удалить позже)
  setup: publicProcedure
    .input(
      z.object({
        group_id: z.number(),
        secret_key: z.string(),
        server_url: z.string().url(),
        events: z.array(z.string()),
        access_token: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { group_id, secret_key, server_url, events, access_token } = input;
      // 1. Получаем все callback-серверы
      const serversData = await getCallbackServers(group_id, access_token);

      if (serversData?.response?.items) {
        // 2. Удаляем все существующие серверы
        for (const server of serversData.response.items) {
          await deleteCallbackServer(group_id, server.id, access_token);
        }
      }
      // 3. Создаем новый сервер
      const addServerData = await addCallbackServer(
        group_id,
        server_url,
        secret_key,
        access_token,
      );

      if (addServerData?.error) {
        throw new Error(
          `Ошибка при добавлении сервера: ${addServerData.error.error_msg}`,
        );
      }
      const serverId = addServerData.response?.server_id;

      if (!serverId) {
        throw new Error("Не удалось получить server_id");
      }

      // 4. Настраиваем события
      if (events && events.length > 0) {
        await setCallbackSettings(group_id, serverId, events, access_token);
      }

      return {
        success: true,
        message: "Callback API успешно настроен",
        server_id: serverId,
      };
    }),
});
