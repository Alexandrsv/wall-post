import bridge, { type AnyReceiveMethodName } from "@vkontakte/vk-bridge";
import type { UserInfo, VKBridgeEvent } from "@vkontakte/vk-bridge";

const consoleStyle = [
  "color: #fff",
  "background-color: #777",
  "padding: 2px 6px",
  "border-radius: 20px",
].join(";");

export const initBridge = (): void => {
  bridge.subscribe((e: VKBridgeEvent<AnyReceiveMethodName>) => {
    switch (e.detail.type) {
      case "VKWebAppUpdateConfig": {
        // eslint-disable-next-line no-console
        console.log("%cBridge", consoleStyle, e.detail);

        break;
      }
      default:
        // eslint-disable-next-line no-console
        console.log("%cBridge", consoleStyle, e.detail);

        return;
    }
  });
  void bridge.send("VKWebAppInit");
};

// Тип для информации о группе
export interface GroupInfo {
  id: number;
  name: string;
  screen_name: string;
  is_closed: number;
  type: string;
  is_admin: 0 | 1;
  is_member: 0 | 1;
  is_advertiser: 0 | 1;
  photo_50: string;
  photo_100: string;
  photo_200: string;
}

// Интерфейс для ответа API
export interface VKAPIResponse<T> {
  response: T;
}

/**
 * Получение информации о пользователе
 */
export async function getUserInfo(): Promise<UserInfo> {
  try {
    return await bridge.send("VKWebAppGetUserInfo");
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error;
  }
}

/**
 * Проверка, открыто ли приложение в сообществе
 */
export async function isOpenedInCommunity(): Promise<boolean> {
  try {
    const launchParams = await bridge.send("VKWebAppGetLaunchParams");

    return !!launchParams.vk_group_id;
  } catch (error) {
    console.error("Error checking if opened in community:", error);

    return false;
  }
}

/**
 * Получение параметров запуска приложения
 */
export async function getLaunchParams() {
  try {
    return await bridge.send("VKWebAppGetLaunchParams");
  } catch (error) {
    console.error("Error getting launch params:", error);
    throw error;
  }
}

/**
 * Получение информации о сообществе
 */
export async function getGroupInfo(
  groupId: string | number,
  accessToken: string,
): Promise<GroupInfo | null> {
  try {
    const response = await bridge.send("VKWebAppCallAPIMethod", {
      method: "groups.getById",
      params: {
        group_id: groupId.toString(),
        fields: "photo_50,photo_100,photo_200",
        v: "5.131",
        access_token: accessToken,
      },
    });

    if (response.response && response.response[0]) {
      return response.response[0];
    }

    return null;
  } catch (error) {
    console.error("Error getting group info:", error);

    return null;
  }
}

/**
 * Получение списка администрируемых сообществ
 */
export async function getAdminGroups(
  accessToken: string,
): Promise<GroupInfo[]> {
  try {
    const response = await bridge.send("VKWebAppCallAPIMethod", {
      method: "groups.get",
      params: {
        filter: "admin",
        extended: 1,
        v: "5.131",
        access_token: accessToken,
      },
    });

    if (response.response?.items) {
      return response.response.items;
    }

    return [];
  } catch (error) {
    console.error("Error getting admin groups:", error);

    return [];
  }
}

/**
 * Открывает окно выбора сообщества
 */
export async function selectCommunity() {
  try {
    return await bridge.send("VKWebAppGetGroupInfo");
  } catch (error) {
    console.error("Error selecting community:", error);
    throw error;
  }
}

/**
 * Открывает настройки приложения
 */
export async function openAppSettings(): Promise<void> {
  try {
    // В VK Mini Apps нет стандартного метода для открытия настроек приложения
    // Попытаемся использовать общие настройки
    console.log("Attempting to open app settings");

    // Вместо несуществующего метода, откроем страницу сообщества
    // или выполним другое действие, доступное в API
    await bridge.send("VKWebAppShowWallPostBox", {
      message: "Настройка приложения для Callback API",
    });
  } catch (error) {
    console.error("Error opening app settings:", error);
    throw error;
  }
}

export default bridge;
