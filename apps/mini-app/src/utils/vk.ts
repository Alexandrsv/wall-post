import axios from "axios";

const VK_API_VERSION = "5.199";
const VK_API_URL = "https://api.vk.com/method";

export const vkApi = axios.create({
  baseURL: VK_API_URL,
  timeout: 10000,
});

export async function getCallbackServers(
  group_id: number,
  access_token: string,
) {
  const { data } = await vkApi.get("/groups.getCallbackServers", {
    params: {
      group_id,
      access_token,
      v: VK_API_VERSION,
    },
  });

  return data;
}

export async function deleteCallbackServer(
  group_id: number,
  server_id: number,
  access_token: string,
) {
  const { data } = await vkApi.get("/groups.deleteCallbackServer", {
    params: {
      group_id,
      server_id,
      access_token,
      v: VK_API_VERSION,
    },
  });

  return data;
}

export async function addCallbackServer(
  group_id: number,
  url: string,
  secret_key: string,
  access_token: string,
) {
  const { data } = await vkApi.get("/groups.addCallbackServer", {
    params: {
      group_id,
      url,
      title: "Main Callback",
      secret_key,
      access_token,
      v: VK_API_VERSION,
    },
  });

  return data;
}

export async function setCallbackSettings(
  group_id: number,
  server_id: number,
  events: string[],
  access_token: string,
) {
  // events: ["message_new", ...]
  const params: Record<string, unknown> = {
    group_id,
    server_id,
    access_token,
    v: VK_API_VERSION,
  };

  for (const event of events) {
    params[event] = 1;
  }
  const { data } = await vkApi.get("/groups.setCallbackSettings", { params });

  return data;
}
