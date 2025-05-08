# @wall-post/prisma

Пакет для работы с базой данных через Prisma ORM.

## Команды

- `yarn prisma:generate` - генерация клиента Prisma
- `yarn prisma:deploy` - применение миграций к базе данных
- `yarn prisma:studio` - запуск Prisma Studio для визуального управления базой данных

## Использование в других пакетах

```typescript
import { PrismaClient } from "@wall-post/prisma";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```
