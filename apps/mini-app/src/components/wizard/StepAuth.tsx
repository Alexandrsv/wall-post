import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

interface StepAuthProps {
  onAuth: () => void;
  loading: boolean;
  error?: string | null;
}

export function StepAuth({ onAuth, loading, error }: StepAuthProps) {
  return (
    <div className="mx-auto max-w-md py-8">
      <h2 className="mb-4 text-center text-2xl font-bold">Авторизация VK</h2>
      <p className="mb-6 text-center text-gray-500">
        Для продолжения необходимо авторизоваться через VK с правами управления
        сообществами.
      </p>
      <Button onClick={onAuth} disabled={loading} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Войти через VK
      </Button>
      {error && (
        <div className="mt-4 text-center text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}
