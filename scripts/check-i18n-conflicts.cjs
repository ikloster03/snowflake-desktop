#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функция для анализа src/i18n.ts
function analyzeI18nConfig() {
  console.log('🔍 Анализ конфигурации i18n...\n');

  try {
    const i18nPath = 'src/i18n.ts';
    const content = fs.readFileSync(i18nPath, 'utf8');

    // Извлекаем импорты
    const importMatches = content.match(/import\s*{\s*(\w+)\s*}\s*from\s*['"]([^'"]+)['"]/g);
    const imports = [];

    if (importMatches) {
      for (const match of importMatches) {
        const parts = match.match(/import\s*{\s*(\w+)\s*}\s*from\s*['"]([^'"]+)['"]/);
        if (parts) {
          imports.push({
            name: parts[1],
            path: parts[2]
          });
        }
      }
    }

    console.log('📦 Найденные импорты i18n:');
    imports.forEach((imp, index) => {
      console.log(`  ${index + 1}. ${imp.name} из ${imp.path}`);
    });

    // Извлекаем порядок объединения
    const enUsMatch = content.match(/'en-US':\s*{([^}]+)}/s);
    const ruRuMatch = content.match(/'ru-RU':\s*{([^}]+)}/s);

    if (enUsMatch) {
      console.log('\n🇺🇸 Порядок объединения для en-US:');
      const spreads = enUsMatch[1].match(/\.\.\.(\w+)\['en-US'\]/g);
      if (spreads) {
        spreads.forEach((spread, index) => {
          const name = spread.match(/\.\.\.(\w+)\[/)[1];
          console.log(`  ${index + 1}. ${name}`);
        });
      }
    }

    if (ruRuMatch) {
      console.log('\n🇷🇺 Порядок объединения для ru-RU:');
      const spreads = ruRuMatch[1].match(/\.\.\.(\w+)\['ru-RU'\]/g);
      if (spreads) {
        spreads.forEach((spread, index) => {
          const name = spread.match(/\.\.\.(\w+)\[/)[1];
          console.log(`  ${index + 1}. ${name}`);
        });
      }
    }

    // Проверяем потенциальные конфликты на основе известных проблем
    console.log('\n⚠️  Потенциальные конфликты:');

    // Известные проблемные ключи
    const knownConflicts = [
      {
        key: 'profile',
        files: ['profileI18n', 'drawerLeftMenuI18n'],
        description: 'Ключ "profile" может конфликтовать между объектом профиля и ссылкой в меню'
      },
      {
        key: 'save',
        files: ['profileI18n', 'projectI18n', 'bookI18n'],
        description: 'Ключ "save" может присутствовать в нескольких модулях'
      },
      {
        key: 'title',
        files: ['profileI18n', 'projectI18n', 'bookI18n', 'stageI18n'],
        description: 'Ключ "title" очень распространен и может конфликтовать'
      }
    ];

    knownConflicts.forEach(conflict => {
      console.log(`\n🔥 Возможный конфликт ключа "${conflict.key}":`);
      console.log(`   Описание: ${conflict.description}`);
      console.log(`   Потенциальные файлы: ${conflict.files.join(', ')}`);
    });

    console.log('\n💡 Рекомендации:');
    console.log('1. Используйте уникальные префиксы для ключей верхнего уровня');
    console.log('2. Избегайте общих ключей типа "save", "title", "profile" на верхнем уровне');
    console.log('3. Группируйте переводы по модулям: { moduleName: { key: value } }');
    console.log('4. Проверяйте порядок объединения в src/i18n.ts');

    console.log('\n🔧 Для детальной проверки:');
    console.log('1. Откройте каждый i18n файл и проверьте структуру ключей');
    console.log('2. Убедитесь, что ключи верхнего уровня уникальны между файлами');
    console.log('3. При конфликтах переименуйте ключи (например: profile → profileLink)');

  } catch (error) {
    console.error('❌ Ошибка анализа:', error.message);
  }
}

// Функция для проверки конкретных файлов
function checkSpecificFiles() {
  console.log('\n📋 Проверка структуры ключей в файлах:');

  const filesToCheck = [
    { name: 'profile.i18n.ts', path: 'src/modules/profile/profile.i18n.ts' },
    { name: 'drawer-left-menu.i18n.ts', path: 'src/modules/layouts/sidebar-menu/drawer-left-menu.i18n.ts' }
  ];

  filesToCheck.forEach(file => {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      console.log(`\n📄 ${file.name}:`);

      // Простой анализ ключей верхнего уровня
      const enUsMatch = content.match(/'en-US':\s*{([^}]+)}/);
      if (enUsMatch) {
        const keys = enUsMatch[1].match(/(\w+):/g);
        if (keys) {
          const topLevelKeys = keys.map(key => key.replace(':', ''));
          console.log(`   Ключи верхнего уровня: ${topLevelKeys.join(', ')}`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Ошибка чтения файла: ${error.message}`);
    }
  });
}

// Запускаем анализ
analyzeI18nConfig();
checkSpecificFiles();
