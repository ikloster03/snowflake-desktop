const projectI18nEn = {
  "project-manager": "Project Manager",
  "current-project": "Current Project",
  "create-project": "Create New Project",
  "open-project": "Open Project",
  "recent-projects": "Recent Projects",
  "last-updated": "Last updated",
  "location": "Location",
  "close-project": "Close Project",
  "open": "Open",
  "welcome": "Welcome to Snowflake",
  "select-project-prompt": "Please select an option to start working",
  "switch-project": "Switch Project",
  "open-another-project": "Open Another Project",
  "create-new-project": "Create New Project",
  "project-name": "Project Name",
  "project-description": "Description",
  "project-location": "Project Location",
  "select-directory": "Select Directory",
  "project-name-required": "Project name is required",
  "project-path-required": "Project location is required",
  "cancel": "Cancel",
  "create": "Create",
  "select-project-file": "Select a Snowflake project file (.snflk)",
  "browse": "Browse",
  "remove-from-recent": "Remove from recent",
  "save": "Save Project",
  "project": {
    "save": "Save Project"
  },
  "save-success": {
    "title": "Project Saved",
    "content": "Your project has been successfully saved."
  },
  "save-error": {
    "title": "Save Error",
    "content": "There was an error saving your project. Please try again."
  },
  "errors": {
    "cant-change-type": {
      "title": "Cannot Change Project Type",
      "content": "Cannot change project type to Single Book when there are multiple books. Please remove extra books first."
    }
  }
} as const;

const projectI18nRu = {
  "project-manager": "Менеджер проектов",
  "current-project": "Текущий проект",
  "create-project": "Создать новый проект",
  "open-project": "Открыть проект",
  "recent-projects": "Недавние проекты",
  "last-updated": "Последнее обновление",
  "location": "Расположение",
  "close-project": "Закрыть проект",
  "open": "Открыть",
  "welcome": "Добро пожаловать в Snowflake",
  "select-project-prompt": "Пожалуйста, выберите действие для начала работы",
  "switch-project": "Сменить проект",
  "open-another-project": "Открыть другой проект",
  "create-new-project": "Создать новый проект",
  "project-name": "Название проекта",
  "project-description": "Описание",
  "project-location": "Расположение проекта",
  "select-directory": "Выбрать папку",
  "project-name-required": "Необходимо указать название проекта",
  "project-path-required": "Необходимо выбрать расположение проекта",
  "cancel": "Отмена",
  "create": "Создать",
  "select-project-file": "Выберите файл проекта Snowflake (.snflk)",
  "browse": "Обзор",
  "remove-from-recent": "Удалить из недавних",
  "save": "Сохранить проект",
  "project": {
    "save": "Сохранить проект"
  },
  "save-success": {
    "title": "Проект сохранен",
    "content": "Ваш проект был успешно сохранен."
  },
  "save-error": {
    "title": "Ошибка сохранения",
    "content": "Произошла ошибка при сохранении проекта. Пожалуйста, попробуйте снова."
  },
  "errors": {
    "cant-change-type": {
      "title": "Невозможно изменить тип проекта",
      "content": "Невозможно изменить тип проекта на 'Одна книга', когда в проекте несколько книг. Пожалуйста, сначала удалите лишние книги."
    }
  }
} as const;

export const projectI18n = {
  'en-US': projectI18nEn,
  'ru-RU': projectI18nRu
} as const;
