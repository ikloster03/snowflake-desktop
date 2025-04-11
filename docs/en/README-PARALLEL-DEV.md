# Parallel Web and Desktop Development

This project implements the ability to develop web and desktop versions of the application in parallel using a unified codebase with Vue 3, Vite, and Tauri.

## Project Structure

```
project/
  ├── src/                 # Common Vue 3 source code
  │   ├── core/            # Application core
  │   │   ├── platform/    # Platform-dependent services
  │   │   │   ├── types.ts # Common interfaces
  │   │   │   ├── platform.factory.ts # Factory for creating services
  │   │   │   ├── web/     # Web platform implementation
  │   │   │   └── desktop/ # Desktop platform implementation (Tauri)
  │   ├── modules/         # Application modules
  │   └── ...
  ├── src-tauri/           # Tauri backend (Rust)
  ├── .env.web             # Environment variables for web version
  ├── .env.desktop         # Environment variables for desktop version
  └── ...
```

## Running the Project

### Development

**Web Version:**

```bash
npm run dev:web
# or
pnpm dev:web
```

**Desktop Version:**

```bash
npm run dev:desktop
# or
pnpm dev:desktop
```

### Building

**Web Version:**

```bash
npm run build:web
# or
pnpm build:web
```

**Desktop Version:**

```bash
npm run build:desktop
# or
pnpm build:desktop
```

## Architecture

### 1. Platform Abstraction

Platform-dependent code is isolated through abstractions:

```typescript
// Interface example
export interface FileSystemService {
  openFileDialog(options?: { extensions?: string[] }): Promise<string | null>;
  saveFile(path: string, content: string): Promise<boolean>;
  readFile(path: string): Promise<string>;
}

// Service access
const fileSystemService =
  PlatformFactory.getInstance().createFileSystemService();
```

### 2. Platform Detection

The following constants are available in the application:

```typescript
// In Vue modules
import { PlatformFactory } from '@/core/platform/platform.factory';

// Get current platform
const platform = PlatformFactory.getInstance().getPlatform(); // 'web' or 'desktop'

// Checks
if (PlatformFactory.getInstance().isDesktop()) {
  // Code only for desktop version
}

if (PlatformFactory.getInstance().isWeb()) {
  // Code only for web version
}
```

You can also use in templates:

```html
<template>
  <div>
    <!-- Conditional rendering based on platform -->
    <div v-if="platformFactory.isDesktop()">
      This will only be visible in the desktop version
    </div>
    <div v-else>This will only be visible in the web version</div>
  </div>
</template>
```

## Best Practices

1. **Platform-dependent code** should be isolated in services in the `src/core/platform/` directory.
2. **Interfaces** for platform-dependent services should be defined in `src/core/platform/types.ts`.
3. **Factory** in `src/core/platform/platform.factory.ts` is used to create platform-dependent services.
4. **Conditional rendering** can be used to show/hide UI components based on the platform.
5. **Use modular architecture** to organize code based on the platform.

## Platform Features

### Web Version

- Browser limitations (file system access through File System Access API)
- Mobile device support required
- Network and API interaction

### Desktop Version (Tauri)

- File system access
- Native window management
- System API access through Tauri API
- Custom window decorations
- System tray integration

## Testing

For testing platform-dependent functions:

```bash
# Tests only for web version
npm run test:web

# Tests only for desktop version
npm run test:desktop

# All tests
npm run test
```
