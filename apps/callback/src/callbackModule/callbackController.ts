import { type VkAllEvents } from "@callback/types/vkCallbackEvents.js";

export const callbackController = (callback: VkAllEvents) => {
  if (callback.type === "confirmation") {
    return "Добавь код в .env и пропиши логику обработки события";
  }

  return "ok";
};
