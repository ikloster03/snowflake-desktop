import { FileSystemService, Platform } from './types';
import { WebFileSystemService } from './web/file-system.service';
import { DesktopFileSystemService } from './desktop/file-system.service';

/**
 * Определяет текущую платформу на основе окружения
 */
export function getCurrentPlatform(): Platform {
  // В режиме разработки можно переопределить платформу через переменную окружения
  const envPlatform = import.meta.env.VITE_PLATFORM as Platform | undefined;

  if (envPlatform && (envPlatform === 'web' || envPlatform === 'desktop')) {
    return envPlatform;
  }

  // В продакшн режиме определяем по глобальной переменной, установленной в vite.config.ts
  // @ts-ignore - Глобальная переменная определена в vite.config.ts
  if (typeof __IS_TAURI__ !== 'undefined' && __IS_TAURI__) {
    return 'desktop';
  }

  return 'web';
}

/**
 * Фабрика для создания платформо-зависимых сервисов
 */
export class PlatformFactory {
  private static instance: PlatformFactory;
  private readonly platform: Platform;

  private constructor() {
    this.platform = getCurrentPlatform();
    console.log(`Текущая платформа: ${this.platform}`);
  }

  /**
   * Получить экземпляр фабрики (синглтон)
   */
  public static getInstance(): PlatformFactory {
    if (!PlatformFactory.instance) {
      PlatformFactory.instance = new PlatformFactory();
    }
    return PlatformFactory.instance;
  }

  /**
   * Получить текущую платформу
   */
  public getPlatform(): Platform {
    return this.platform;
  }

  /**
   * Создать сервис для работы с файловой системой
   */
  public createFileSystemService(): FileSystemService {
    if (this.platform === 'desktop') {
      return new DesktopFileSystemService();
    }
    return new WebFileSystemService();
  }

  /**
   * Проверить, выполняется ли приложение на десктопной платформе
   */
  public isDesktop(): boolean {
    return this.platform === 'desktop';
  }

  /**
   * Проверить, выполняется ли приложение на веб-платформе
   */
  public isWeb(): boolean {
    return this.platform === 'web';
  }
}
