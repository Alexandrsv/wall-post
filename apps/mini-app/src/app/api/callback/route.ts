import { NextResponse } from "next/server";
import crypto from "crypto";

// В реальном приложении этот ключ должен храниться в безопасном месте
const secretKeys: { [groupId: string]: string } = {};

// Типы для работы с сообщениями ВК
interface VKMessage {
  id: number;
  date: number;
  peer_id: number;
  from_id: number;
  text: string;
  random_id?: number;
  attachments?: unknown[];
  important?: boolean;
  payload?: string;
  [key: string]: unknown;
}

// Обработка POST запросов от VK Callback API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, group_id, event, secret } = body;

    console.log("Получен Callback запрос:", { type, group_id, event });

    // Проверка секретного ключа
    const storedSecret = secretKeys[group_id?.toString()];

    if (storedSecret && secret !== storedSecret) {
      console.error("Неверный секретный ключ");

      return NextResponse.json(
        { error: "Неверный секретный ключ" },
        { status: 403 },
      );
    }

    // Обработка запроса на подтверждение сервера
    if (type === "confirmation") {
      // В реальном приложении код подтверждения должен быть получен из VK API
      // и храниться в базе данных для каждого сообщества
      return new Response("a1b2c3d4e5", { status: 200 });
    }

    // Обработка различных типов событий
    switch (event?.type) {
      case "message_new":
        await handleNewMessage(event.object);
        break;
      case "message_reply":
        await handleMessageReply(event.object);
        break;
      // Добавьте обработку других событий по мере необходимости
    }

    // Всегда возвращаем "ok" для успешной обработки событий
    return new Response("ok", { status: 200 });
  } catch (error: Error | unknown) {
    console.error("Ошибка при обработке Callback запроса:", error);

    return NextResponse.json(
      {
        error: "Ошибка при обработке запроса",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// Обработчик нового сообщения
async function handleNewMessage(messageData: VKMessage | unknown) {
  console.log("Новое сообщение:", messageData);
  // Здесь логика обработки нового сообщения
}

// Обработчик ответа на сообщение
async function handleMessageReply(messageData: VKMessage | unknown) {
  console.log("Ответ на сообщение:", messageData);
  // Здесь логика обработки ответа на сообщение
}

// API для сохранения секретного ключа
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { group_id, secret_key } = body;

    if (!group_id || !secret_key) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные параметры" },
        { status: 400 },
      );
    }

    // Сохраняем секретный ключ для группы
    secretKeys[group_id.toString()] = secret_key;
    console.log(`Сохранен секретный ключ для сообщества ${group_id}`);

    return NextResponse.json({ success: true });
  } catch (error: Error | unknown) {
    console.error("Ошибка при сохранении секретного ключа:", error);

    return NextResponse.json(
      {
        error: "Ошибка при сохранении секретного ключа",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// Маршрут для настройки Callback API
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message:
      "VK Callback API endpoint is ready. Use POST method to receive callbacks.",
  });
}
