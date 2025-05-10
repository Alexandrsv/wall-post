import { NextResponse } from "next/server";

// В реальном приложении здесь должно быть безопасное хранилище токенов
// Для демонстрации используем in-memory хранилище
const tokenStorage: {
  user?: string;
  community?: { [groupId: string]: string };
} = {
  community: {},
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, token, group_id } = body;

    if (!type || !token) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные параметры" },
        { status: 400 },
      );
    }

    if (type === "user") {
      // Сохраняем пользовательский токен
      tokenStorage.user = token;
      console.log("Сохранен токен пользователя");
    } else if (type === "community" && group_id) {
      // Сохраняем токен сообщества
      if (!tokenStorage.community) {
        tokenStorage.community = {};
      }
      tokenStorage.community[group_id.toString()] = token;
      console.log(`Сохранен токен сообщества ${group_id}`);
    } else {
      return NextResponse.json(
        { error: "Неверный тип токена или отсутствует ID сообщества" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: Error | unknown) {
    console.error("Ошибка при сохранении токена:", error);

    return NextResponse.json(
      {
        error: "Ошибка при сохранении токена",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
