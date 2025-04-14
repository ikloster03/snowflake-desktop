# snowflake-desktop

MVP десктоп приложения для проектирования книг.

> Статус готовности - 60%

## Установка и настройка

1. Установите зависимости:

   ```bash
   pnpm install
   ```

2. Настройка Git хуков:

   ```bash
   npx simple-git-hooks
   ```

   Если у вас возникает ошибка PowerShell с сообщением о том, что выполнение сценариев отключено,
   выполните следующую команду с повышенными правами:

   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```

   А затем снова запустите:

   ```bash
   npx simple-git-hooks
   ```

## Git хуки

В проекте настроены следующие Git хуки:

- **commit-msg**: Проверяет соответствие сообщений коммитов правилам Conventional Commits
- **pre-push**: Запускает проверку типов и тесты перед отправкой изменений на сервер

Действие хука pre-push:

```bash
pnpm type-check && pnpm test run
```

## Запуск проекта

### Веб-версия

```bash
pnpm dev:web
```

### Десктопная версия (Tauri)

```bash
pnpm dev:desktop
```

## Сборка

### Веб-версия

```bash
pnpm build:web
```

### Десктопная версия (Tauri)

```bash
pnpm build:desktop
```

## Проверка типов и тестирование

```bash
# Проверка типов
pnpm type-check

# Проверка типов с улучшенным форматированием
pnpm lint:types

# Запуск тестов
pnpm test

# Запуск тестов с отчетом о покрытии
pnpm test:coverage

# Запуск тестов с UI
pnpm test:ui
```

## Документация

```bash
# Разработка документации
pnpm docs:dev

# Сборка документации
pnpm docs:build

# Предпросмотр документации
pnpm docs:preview
```
