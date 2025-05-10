import { useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import { api } from "~/trpc/react";

export type WizardStep =
  | "auth"
  | "selectGroup"
  | "groupToken"
  | "callbackSetup"
  | "success";

export interface VkGroup {
  id: number;
  name: string;
  photo_100: string;
  admin_level: number;
}

export function useVkWizard() {
  const [step, setStep] = useState<WizardStep>("auth");
  const [userToken, setUserToken] = useState<string | null>(null);
  const [groups, setGroups] = useState<VkGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<VkGroup | null>(null);
  const [communityToken, setCommunityToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // trpc
  const saveGroupToken = api.callback.saveGroupToken.useMutation();
  const createCallbackServer = api.callback.createCallbackServer.useMutation();
  const updateCallbackServer = api.callback.updateCallbackServer.useMutation();
  const getCallbackServer = api.callback.getCallbackServer.useQuery(
    selectedGroup ? { group_id: selectedGroup.id } : { group_id: 0 },
    { enabled: !!selectedGroup },
  );

  // 1. Авторизация пользователя
  const handleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const { access_token } = await bridge.send("VKWebAppGetAuthToken", {
        app_id: parseInt(process.env.NEXT_PUBLIC_VK_APP_ID || "0", 10),
        scope: "groups",
      });
      setUserToken(access_token);
      setStep("selectGroup");
    } catch (e) {
      setError(
        "Ошибка авторизации: " + (e instanceof Error ? e.message : String(e)),
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Получение групп пользователя
  const fetchGroups = async () => {
    setLoading(true);
    setError(null);

    try {
      if (userToken) {
        const { response } = await bridge.send("VKWebAppCallAPIMethod", {
          method: "groups.get",
          params: {
            filter: "admin",
            fields: "name,photo_100",
            extended: 1,
            v: "5.131",
            access_token: userToken,
          },
        });
        setGroups(response.items);
      }
    } catch (e) {
      setError(
        "Ошибка получения групп: " +
          (e instanceof Error ? e.message : String(e)),
      );
    } finally {
      setLoading(false);
    }
  };

  // 3. Получение токена сообщества
  const handleGetCommunityToken = async () => {
    if (!selectedGroup) return;
    setLoading(true);
    setError(null);

    try {
      const { access_token } = await bridge.send("VKWebAppGetCommunityToken", {
        app_id: parseInt(process.env.NEXT_PUBLIC_VK_APP_ID || "0", 10),
        group_id: selectedGroup.id,
        scope: "manage",
      });
      setCommunityToken(access_token);
      // Сохраняем токен на бэке
      await saveGroupToken.mutateAsync({
        group_id: selectedGroup.id,
        token: access_token,
      });
      setStep("callbackSetup");
    } catch (e) {
      setError(
        "Ошибка получения токена сообщества: " +
          (e instanceof Error ? e.message : String(e)),
      );
    } finally {
      setLoading(false);
    }
  };

  // 4. Настройка callback сервера
  const handleSetupCallback = async (params: {
    url: string;
    secret_key: string;
    events: string[];
  }) => {
    if (!selectedGroup) return;
    setLoading(true);
    setError(null);

    try {
      await createCallbackServer.mutateAsync({
        group_id: selectedGroup.id,
        url: params.url,
        secret_key: params.secret_key,
      });
      // Обновляем события
      const servers = await getCallbackServer.refetch();
      const serverId = servers.data?.response?.items?.[0]?.id;

      if (serverId) {
        await updateCallbackServer.mutateAsync({
          group_id: selectedGroup.id,
          server_id: serverId,
          events: params.events,
        });
      }
      setStep("success");
    } catch (e) {
      setError(
        "Ошибка настройки Callback API: " +
          (e instanceof Error ? e.message : String(e)),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    userToken,
    groups,
    fetchGroups,
    selectedGroup,
    setSelectedGroup,
    communityToken,
    error,
    loading,
    handleAuth,
    handleGetCommunityToken,
    handleSetupCallback,
    getCallbackServer,
  };
}
