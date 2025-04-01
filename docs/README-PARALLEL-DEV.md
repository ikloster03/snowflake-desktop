# Параллельная разработка веб и десктоп версий

В этом проекте реализована возможность параллельной разработки веб и десктоп версий приложения с использованием единой кодовой базы Vue 3, Vite и Tauri.

## Структура проекта

```
project/
  ├── src/                 # Общий исходный код Vue 3
  │   ├── core/            # Ядро приложения
  │   │   ├── platform/    # Платформо-зависимые сервисы
  │   │   │   ├── types.ts # Общие интерфейсы
  │   │   │   ├── platform.factory.ts # Фабрика для создания сервисов
  │   │   │   ├── web/     # Реализация для веб-платформы
  │   │   │   └── desktop/ # Реализация для десктоп-платформы (Tauri)
  │   ├── modules/         # Модули приложения
  │   └── ...
  ├── src-tauri/           # Tauri backend (Rust)
  ├── .env.web             # Переменные окружения для веб-версии
  ├── .env.desktop         # Переменные окружения для десктоп-версии
  └── ...
```

## Запуск проекта

### Разработка

**Веб-версия:**

```bash
npm run dev:web
# или
pnpm dev:web
```

**Десктоп-версия:**

```bash
npm run dev:desktop
# или
pnpm dev:desktop
```

### Сборка

**Веб-версия:**

```bash
npm run build:web
# или
pnpm build:web
```

**Десктоп-версия:**

```bash
npm run build:desktop
# или
pnpm build:desktop
```

## Архитектура

### 1. Платформенная абстракция

Платформо-зависимый код изолирован через абстракции:

```typescript
// Пример интерфейса
export interface FileSystemService {
  openFileDialog(options?: { extensions?: string[] }): Promise<string | null>;
  saveFile(path: string, content: string): Promise<boolean>;
  readFile(path: string): Promise<string>;
}

// Доступ к сервису
const fileSystemService =
  PlatformFactory.getInstance().createFileSystemService();
```

### 2. Определение платформы

В приложении доступны следующие константы:

```typescript
// В модулях Vue
import { PlatformFactory } from '@/core/platform/platform.factory';

// Получить текущую платформу
const platform = PlatformFactory.getInstance().getPlatform(); // 'web' или 'desktop'

// Проверки
if (PlatformFactory.getInstance().isDesktop()) {
  // Код только для десктоп-версии
}

if (PlatformFactory.getInstance().isWeb()) {
  // Код только для веб-версии
}
```

Также в шаблонах можно использовать:

```html
<template>
  <div>
    <!-- Условный рендеринг в зависимости от платформы -->
    <div v-if="platformFactory.isDesktop()">
      Это будет видно только в десктопной версии
    </div>
    <div v-else>Это будет видно только в веб-версии</div>
  </div>
</template>
```

## Лучшие практики

1. **Платформо-зависимый код** должен быть изолирован в сервисах в директории `src/core/platform/`.
2. **Интерфейсы** для платформо-зависимых сервисов должны быть определены в `src/core/platform/types.ts`.
3. **Фабрика** в `src/core/platform/platform.factory.ts` используется для создания платформо-зависимых сервисов.
4. **Условный рендеринг** можно использовать для показа/скрытия компонентов UI в зависимости от платформы.
5. **Используйте модульную архитектуру** для организации кода в зависимости от платформы.

## Особенности платформ

### Веб-версия

- Ограничения браузеров (доступ к файловой системе через File System Access API)
- Необходима поддержка мобильных устройств
- Работа с сетью и API

### Десктоп-версия (Tauri)

- Доступ к файловой системе
- Работа с нативными окнами
- Доступ к системным API через Tauri API
- Кастомные заголовки окон
- Системный трей

## Тестирование

Для тестирования платформо-зависимых функций:

```bash
# Тесты только для веб-версии
npm run test:web

# Тесты только для десктоп-версии
npm run test:desktop

# Все тесты
npm run test
```
