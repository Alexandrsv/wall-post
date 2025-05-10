import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface StepCallbackSetupProps {
  onSetup: (params: {
    url: string;
    secret_key: string;
    events: string[];
  }) => void;
  loading: boolean;
  error?: string | null;
}

const EVENTS = [
  { name: "message_new", label: "Новое сообщение" },
  { name: "wall_post_new", label: "Новая запись на стене" },
  { name: "wall_reply_new", label: "Новый комментарий к записи" },
] as const;

export function StepCallbackSetup({
  onSetup,
  loading,
  error,
}: StepCallbackSetupProps) {
  const [url, setUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [events, setEvents] = useState<string[]>([EVENTS[0].name]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}/api/callback`);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetup({ url, secret_key: secret, events });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6 py-8">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Настройка Callback API
      </h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="url">URL сервера</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/api/callback"
            required
          />
        </div>
        <div>
          <Label htmlFor="secret">
            Секретный ключ{" "}
            <span className="text-muted-foreground text-xs">
              (необязательно)
            </span>
          </Label>
          <Input
            id="secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Оставьте пустым, если не требуется"
          />
        </div>
        <div>
          <Label>События</Label>
          <div className="space-y-2">
            {EVENTS.map((ev) => (
              <div key={ev.name} className="flex items-center space-x-2">
                <Checkbox
                  id={ev.name}
                  checked={events.includes(ev.name)}
                  onCheckedChange={(checked) => {
                    setEvents((prev) =>
                      checked
                        ? [...prev, ev.name]
                        : prev.filter((e) => e !== ev.name),
                    );
                  }}
                />
                <Label htmlFor={ev.name}>{ev.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      {error && <div className="text-center text-sm text-red-600">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Настроить Callback API
      </Button>
    </form>
  );
}
