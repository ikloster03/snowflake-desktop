#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const PACKAGE_JSON_PATH = join(rootDir, 'package.json');

/**
 * Выполняет git команду
 */
function execGit(command) {
  try {
    const result = execSync(command, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.trim();
  } catch (error) {
    throw new Error(`Git command failed: ${command}\n${error.message}`);
  }
}

/**
 * Проверяет, есть ли незакоммиченные изменения
 */
function checkWorkingDirectory() {
  try {
    const status = execGit('git status --porcelain');
    return status.length === 0;
  } catch (error) {
    throw new Error('Не удалось проверить статус git репозитория');
  }
}

/**
 * Проверяет, существует ли тег
 */
function tagExists(tagName) {
  try {
    execGit(`git rev-parse ${tagName}`);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Получает текущую версию из package.json
 */
function getCurrentVersion() {
  const content = readFileSync(PACKAGE_JSON_PATH, 'utf8');
  const packageJson = JSON.parse(content);
  return packageJson.version;
}

/**
 * Создает и отправляет тег
 */
function createAndPushTag(version, force = false) {
  const tagName = `v${version}`;

  console.log(`Creating tag: ${tagName}`);

  // Проверяем, существует ли тег
  if (tagExists(tagName) && !force) {
    throw new Error(`Tag ${tagName} already exists. Use --force to overwrite.`);
  }

  // Создаем тег
  const tagCommand = force
    ? `git tag -f ${tagName} -m "Release ${tagName}"`
    : `git tag ${tagName} -m "Release ${tagName}"`;

  execGit(tagCommand);
  console.log(`✅ Created tag: ${tagName}`);

  // Отправляем тег
  const pushCommand = force
    ? `git push origin ${tagName} --force`
    : `git push origin ${tagName}`;

  execGit(pushCommand);
  console.log(`✅ Pushed tag: ${tagName}`);

  return tagName;
}

/**
 * Основная функция
 */
function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node create-tag.js [--force]');
    console.log('');
    console.log('Creates and pushes a git tag based on current package.json version');
    console.log('');
    console.log('Options:');
    console.log('  --force, -f    Overwrite existing tag');
    console.log('  --help, -h     Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  pnpm version:tag       # Create tag from current version');
    console.log('  pnpm version:release   # Update patch version and create tag');
    process.exit(0);
  }

  try {
    // Получаем текущую версию
    const currentVersion = getCurrentVersion();
    console.log(`Current version: ${currentVersion}`);

    // Проверяем рабочую директорию
    if (!checkWorkingDirectory()) {
      console.log('⚠️  Warning: You have uncommitted changes in your working directory.');
      console.log('   Consider committing them before creating a tag.');
      console.log('');
    }

    // Создаем и отправляем тег
    const tagName = createAndPushTag(currentVersion, force);

    console.log('');
    console.log(`🎉 Successfully created and pushed tag: ${tagName}`);
    console.log('');
    console.log('GitHub Actions will now:');
    console.log('- Build the application for all platforms');
    console.log('- Create a GitHub Release');
    console.log('- Attach build artifacts to the release');
    console.log('');
    console.log(`View the release at: https://github.com/YOUR_USERNAME/YOUR_REPO/releases/tag/${tagName}`);

  } catch (error) {
    console.error('❌ Error creating tag:', error.message);
    process.exit(1);
  }
}

main();
