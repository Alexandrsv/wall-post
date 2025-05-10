import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import type { VkGroup } from "~/hooks/useVkWizard";

interface StepGroupTokenProps {
  group: VkGroup;
  onGetToken: () => void;
  loading: boolean;
  error?: string | null;
}

export function StepGroupToken({
  group,
  onGetToken,
  loading,
  error,
}: StepGroupTokenProps) {
  return (
    <div className="mx-auto max-w-md py-8">
      <h2 className="mb-4 text-center text-2xl font-bold">Токен сообщества</h2>
      <div className="mb-4 flex items-center">
        <img
          src={group.photo_100}
          alt={group.name}
          className="mr-3 h-10 w-10 rounded-full"
        />
        <div>
          <p className="font-medium">{group.name}</p>
          <p className="text-sm text-gray-500">ID: {group.id}</p>
        </div>
      </div>
      <p className="mb-6 text-center text-gray-500">
        Для настройки Callback API требуется получить токен сообщества с правами
        управления.
      </p>
      <Button onClick={onGetToken} disabled={loading} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Получить токен сообщества
      </Button>
      {error && (
        <div className="mt-4 text-center text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}
