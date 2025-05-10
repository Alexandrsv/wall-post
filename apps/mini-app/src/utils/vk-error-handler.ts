interface VKBridgeError {
  error_type: string;
  error_data: {
    error_code: number;
    error_reason: string;
    error_description?: string;
  };
  [key: string]: unknown;
}

/**
 * Проверяет, является ли объект ошибкой VK Bridge
 */
export function isVKBridgeError(error: unknown): error is VKBridgeError {
  return (
    error !== null &&
    typeof error === "object" &&
    "error_data" in error &&
    typeof error.error_data === "object"
  );
}

/**
 * Конвертирует ошибку VK Bridge в читаемое сообщение
 */
export function formatVKBridgeError(error: unknown): string {
  if (isVKBridgeError(error)) {
    return [
      error.error_type || "",
      error.error_data?.error_reason || "",
      error.error_data?.error_description || "",
    ]
      .filter(Boolean)
      .join(": ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

/**
 * Обрабатывает ошибку и возвращает читаемое сообщение
 */
export function handleVKError(prefix: string, error: unknown): string {
  console.error(`${prefix} error:`, error);

  return `${prefix}: ${formatVKBridgeError(error)}`;
}
