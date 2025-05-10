"use client";

import { Wizard } from "~/components/wizard/Wizard";
import { initBridge } from "~/lib/vk-bridge";
import { ThemeSwitcher } from "~/components/ui/ThemeSwitcher";

interface Group {
  id: number;
  name: string;
  photo_100: string;
  admin_level: number;
}

initBridge();

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-2 flex justify-end">
        <ThemeSwitcher />
      </div>
      <h1 className="mb-6 text-center text-3xl font-bold">
        Настройка VK Callback API
      </h1>
      <Wizard />
    </div>
  );
}
