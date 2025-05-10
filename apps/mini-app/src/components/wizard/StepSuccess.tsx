import { CheckCircle } from "lucide-react";

export function StepSuccess() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
      <h2 className="mb-2 text-2xl font-bold">Готово!</h2>
      <p className="mb-4 text-gray-700">
        Callback API успешно настроен для вашего сообщества.
      </p>
      <p className="text-sm text-gray-500">
        Теперь вы будете получать события от VK на указанный сервер.
      </p>
    </div>
  );
}
