# Управление версиями

В проекте настроено автоматическое управление версиями с использованием семантического версионирования (SemVer).

## Доступные команды

### Показать текущую версию
```bash
pnpm version:show
```

### Обновить версию (только файлы, без коммита)

#### Patch версия (исправления багов)
```bash
pnpm version:patch
# 0.2.0 -> 0.2.1
```

#### Minor версия (новые функции)
```bash
pnpm version:minor
# 0.2.0 -> 0.3.0
```

#### Major версия (breaking changes)
```bash
pnpm version:major
# 0.2.0 -> 1.0.0
```

#### Prerelease версия (тестовые релизы)
```bash
pnpm version:prerelease
# 0.2.0 -> 0.2.1-0
```

### Полный релиз (обновление + коммит + тег)

#### Patch релиз (рекомендуется)
```bash
pnpm version:release
# Обновляет patch версию, коммитит изменения и создает тег
```

#### Minor релиз
```bash
pnpm version:release:minor
# Обновляет minor версию, коммитит изменения и создает тег
```

#### Major релиз
```bash
pnpm version:release:major
# Обновляет major версию, коммитит изменения и создает тег
```

#### Prerelease релиз
```bash
pnpm version:release:prerelease
# Обновляет prerelease версию, коммитит изменения и создает тег
```

### Создание тегов

#### Создать тег по текущей версии
```bash
pnpm version:tag
# Создает и отправляет тег v0.2.1 для текущей версии (без коммита)
```

## Что происходит при полном релизе

1. **Проверка рабочей директории** - убеждается, что нет незакоммиченных изменений
2. **Автоматическое обновление файлов:**
   - `package.json` - версия фронтенда
   - `src-tauri/Cargo.toml` - версия Rust бэкенда
   - `src-tauri/Cargo.lock` - обновление зависимостей
3. **Автоматический коммит** изменений версий
4. **Создание и отправка тега**
5. **Запуск GitHub Actions** для сборки релиза

## Процесс создания релиза

### Быстрый способ (рекомендуется) ⭐

```bash
# Для patch релиза (исправления багов)
pnpm version:release

# Для minor релиза (новые функции)
pnpm version:release:minor

# Для major релиза (breaking changes)
pnpm version:release:major
```

**Что происходит автоматически:**
- ✅ Обновляет версию в файлах
- ✅ Обновляет Cargo.lock с новыми зависимостями
- ✅ Коммитит изменения с сообщением "chore: bump version to vX.X.X"
- ✅ Создает тег vX.X.X
- ✅ Отправляет коммит и тег в репозиторий
- ✅ Запускает GitHub Actions для сборки

### Пошаговый способ (для контроля)

1. **Обновите версию:**
   ```bash
   pnpm version:patch  # или minor/major
   ```

2. **Проверьте изменения:**
   ```bash
   git diff
   ```

3. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "chore: bump version to v0.2.1"
   ```

4. **Создайте и отправьте тег:**
   ```bash
   pnpm version:tag
   ```

### Опции для релизов

```bash
# Принудительная перезапись существующего тега
pnpm version:release --force

# Показать справку
node scripts/release.js --help
```

## Безопасность и проверки

- ✅ **Проверка рабочей директории** - скрипт не позволит создать релиз при наличии незакоммиченных изменений
- ✅ **Проверка существующих тегов** - предупреждает о существующих тегах
- ✅ **Атомарность операций** - если что-то пошло не так, изменения можно откатить
- ✅ **Автоматический push** - коммит и тег отправляются автоматически

## Семантическое версионирование

Следуем стандарту [SemVer](https://semver.org/lang/ru/):

- **MAJOR** (1.0.0): Несовместимые изменения API
- **MINOR** (0.1.0): Новая функциональность, совместимая с предыдущими версиями
- **PATCH** (0.0.1): Исправления багов, совместимые с предыдущими версиями

## Примеры

```bash
# Текущая версия: 0.2.0

# Исправили баг - полный patch релиз
pnpm version:release  # -> 0.2.1 + коммит + тег v0.2.1

# Добавили новую функцию - полный minor релиз
pnpm version:release:minor  # -> 0.3.0 + коммит + тег v0.3.0

# Кардинально изменили архитектуру - полный major релиз
pnpm version:release:major  # -> 1.0.0 + коммит + тег v1.0.0

# Создали тестовую версию
pnpm version:release:prerelease  # -> 0.2.1-0 + коммит + тег v0.2.1-0

# Только обновить версию без коммита (старый способ)
pnpm version:patch && pnpm version:tag

# Просто создать тег для текущей версии
pnpm version:tag
```

## Откат изменений

Если что-то пошло не так:

```bash
# Удалить последний коммит (но сохранить изменения)
git reset --soft HEAD~1

# Удалить тег локально
git tag -d v0.2.1

# Удалить тег на сервере
git push origin :refs/tags/v0.2.1
```

## Системные зависимости

### Ubuntu/Debian
Для сборки Tauri приложения на Ubuntu/Debian необходимы следующие пакеты:

```bash
sudo apt-get update
sudo apt-get install -y \
  libgtk-3-dev \
  libwebkit2gtk-4.0-dev \
  libwebkit2gtk-4.1-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf \
  libsoup-3.0-dev \
  libjavascriptcoregtk-4.1-dev \
  libssl-dev \
  pkg-config
```

### Решение проблем

#### Проблема с libsoup-3.0
Если получаете ошибку:
```
The system library `libsoup-3.0` required by crate `soup3-sys` was not found.
```

**Решение:** Установите `libsoup-3.0-dev`:
```bash
sudo apt-get install libsoup-3.0-dev pkg-config
```

#### Проблема с proxy 'cursor'
Если получаете ошибку:
```
error: unknown proxy name: 'cursor'
```

**Решение:** Эта проблема возникает при использовании Cursor IDE. Скрипт релиза автоматически использует чистое окружение для cargo команд.

Если проблема остается, можно вручную запустить:
```bash
cd src-tauri
env -i HOME=$HOME USER=$USER PATH=$HOME/.cargo/bin:/usr/local/bin:/usr/bin:/bin cargo update
```

## Git Hooks

Проект использует Git hooks для автоматической проверки качества кода:

### Настроенные хуки

1. **commit-msg** - проверяет соответствие сообщений коммитов стандарту Conventional Commits
2. **pre-push** - запускает полную проверку перед отправкой в репозиторий

### Команды для работы с хуками

```bash
# Переустановить хуки
pnpm hooks:install

# Протестировать commit-msg хук
pnpm hooks:test:commit

# Протестировать pre-push хук  
pnpm hooks:test:pre-push

# Полная переустановка (запускается автоматически при pnpm install)
pnpm prepare
```

### Что происходит при коммите

Теперь при коммите вы увидите:
```
🔍 Checking commit message...
✅ Commit message is valid
```

### Что происходит при push

При отправке изменений запускается:
```
🚀 Running pre-push checks...
📦 Installing dependencies...
🔍 Type checking...
🧪 Running tests...
📚 Building docs...
✅ Pre-push checks passed
```

### Если хуки не работают

1. **Переустановите хуки:**
   ```bash
   pnpm hooks:install
   ```

2. **Проверьте права доступа:**
   ```bash
   ls -la .git/hooks/
   ```

3. **Ручная проверка:**
   ```bash
   # Проверить commit message
   echo "feat: add new feature" | npx commitlint
   
   # Запустить pre-push проверки
   pnpm pre-push
   ```
