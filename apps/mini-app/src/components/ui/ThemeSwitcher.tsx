"use client";
import { Switch } from "~/components/ui/switch";
import { useTheme } from "~/lib/theme";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs">🌞</span>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Переключить тему"
      />
      <span className="text-xs">🌚</span>
      <button
        type="button"
        className="text-muted-foreground ml-2 text-xs underline"
        onClick={() => setTheme("system")}
        aria-label="Системная тема"
      >
        Системная
      </button>
    </div>
  );
}
