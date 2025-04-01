/**
 * Типы платформ, поддерживаемых приложением
 */
export type Platform = 'web' | 'desktop';

/**
 * Платформо-зависимый сервис для работы с файловой системой
 */
export interface FileSystemService {
  /**
   * Открыть диалог выбора файла
   * @param options Опции диалога
   */
  openFileDialog(options?: { extensions?: string[] }): Promise<string | null>;

  /**
   * Сохранить файл
   * @param path Путь к файлу
   * @param content Содержимое файла
   */
  saveFile(path: string, content: string): Promise<boolean>;

  /**
   * Прочитать файл
   * @param path Путь к файлу
   */
  readFile(path: string): Promise<string>;
}

/**
 * Платформо-зависимый сервис для работы с окнами приложения
 */
export interface WindowService {
  /**
   * Установить название окна
   * @param title Название окна
   */
  setTitle(title: string): Promise<void>;

  /**
   * Закрыть окно
   */
  close(): Promise<void>;

  /**
   * Свернуть окно
   */
  minimize(): Promise<void>;

  /**
   * Развернуть окно
   */
  maximize(): Promise<void>;
}

/**
 * Платформо-зависимый сервис для работы с сетью
 */
export interface NetworkService {
  /**
   * Отправить запрос
   * @param url URL запроса
   * @param options Опции запроса
   */
  fetch<T>(url: string, options?: RequestInit): Promise<T>;
}
