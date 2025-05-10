import { Button } from "~/components/ui/button";
import { type VkGroup } from "~/hooks/useVkWizard";
import { Loader2 } from "lucide-react";

interface StepSelectGroupProps {
  groups: VkGroup[];
  onSelect: (group: VkGroup) => void;
  onRefresh: () => void;
  loading: boolean;
  error?: string | null;
}

export function StepSelectGroup({
  groups,
  onSelect,
  onRefresh,
  loading,
  error,
}: StepSelectGroupProps) {
  return (
    <div className="mx-auto max-w-xl py-8">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Выберите сообщество
      </h2>
      <p className="mb-4 text-center text-gray-500">
        Выберите сообщество, для которого хотите настроить Callback API.
      </p>
      <Button onClick={onRefresh} disabled={loading} className="mb-4 w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Обновить список сообществ
      </Button>
      {error && (
        <div className="mb-4 text-center text-sm text-red-600">{error}</div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.id}
            className="hover:bg-primary/10 flex cursor-pointer items-center rounded-md border p-3"
            onClick={() => onSelect(group)}
          >
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
        ))}
      </div>
    </div>
  );
}
