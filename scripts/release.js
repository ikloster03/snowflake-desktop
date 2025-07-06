#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import semver from 'semver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const PACKAGE_JSON_PATH = join(rootDir, 'package.json');
const CARGO_TOML_PATH = join(rootDir, 'src-tauri', 'Cargo.toml');
const TAURI_CONF_PATH = join(rootDir, 'src-tauri', 'tauri.conf.json');

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
 * Проверяет, есть ли незакоммиченные изменения (кроме версий)
 */
function checkWorkingDirectory() {
  try {
    const status = execGit('git status --porcelain');
    if (status.length === 0) return { clean: true, hasVersionChanges: false };

    // Проверяем, есть ли изменения только в файлах версий
    const lines = status.split('\n').filter(line => line.trim());
    const versionFiles = ['package.json', 'src-tauri/Cargo.toml', 'src-tauri/Cargo.lock', 'src-tauri/tauri.conf.json'];
    const nonVersionChanges = lines.filter(line => {
      const filePath = line.substring(3).trim();
      return !versionFiles.includes(filePath);
    });

    return {
      clean: nonVersionChanges.length === 0,
      hasVersionChanges: lines.some(line => {
        const filePath = line.substring(3).trim();
        return versionFiles.includes(filePath);
      }),
      allChanges: lines
    };
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
 * Читает и парсит package.json
 */
function readPackageJson() {
  const content = readFileSync(PACKAGE_JSON_PATH, 'utf8');
  return JSON.parse(content);
}

/**
 * Записывает package.json
 */
function writePackageJson(packageJson) {
  const content = JSON.stringify(packageJson, null, 2) + '\n';
  writeFileSync(PACKAGE_JSON_PATH, content, 'utf8');
}

/**
 * Читает Cargo.toml
 */
function readCargoToml() {
  return readFileSync(CARGO_TOML_PATH, 'utf8');
}

/**
 * Записывает Cargo.toml с обновленной версией
 */
function writeCargoToml(content, newVersion) {
  const updatedContent = content.replace(
    /^version = "[\d\w\.\-]+"$/m,
    `version = "${newVersion}"`
  );
  writeFileSync(CARGO_TOML_PATH, updatedContent, 'utf8');
}

/**
 * Читает и парсит tauri.conf.json
 */
function readTauriConf() {
  const content = readFileSync(TAURI_CONF_PATH, 'utf8');
  return JSON.parse(content);
}

/**
 * Записывает tauri.conf.json
 */
function writeTauriConf(tauriConf) {
  const content = JSON.stringify(tauriConf, null, 2) + '\n';
  writeFileSync(TAURI_CONF_PATH, content, 'utf8');
}

/**
 * Обновляет версию в соответствии с semver
 */
function updateVersion(currentVersion, releaseType) {
  const validReleaseTypes = ['major', 'minor', 'patch', 'prerelease'];

  if (!validReleaseTypes.includes(releaseType)) {
    throw new Error(`Invalid release type: ${releaseType}. Valid types: ${validReleaseTypes.join(', ')}`);
  }

  const newVersion = semver.inc(currentVersion, releaseType);

  if (!newVersion) {
    throw new Error(`Failed to increment version ${currentVersion} with type ${releaseType}`);
  }

  return newVersion;
}

/**
 * Обновляет Cargo.lock после изменения версии в Cargo.toml
 */
function updateCargoLock() {
  try {
    console.log('Updating Cargo.lock...');

    // Создаем чистое окружение для cargo команд
    const cleanEnv = {
      HOME: process.env.HOME,
      USER: process.env.USER,
      PATH: `${process.env.HOME}/.cargo/bin:/usr/local/bin:/usr/bin:/bin`,
      LANG: process.env.LANG || 'en_US.UTF-8',
      LC_ALL: process.env.LC_ALL || 'en_US.UTF-8'
    };

    const result = execSync('cargo update --workspace', {
      cwd: join(rootDir, 'src-tauri'),
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: cleanEnv
    });
    console.log('✅ Updated Cargo.lock');
  } catch (error) {
    // Если cargo update не удался, попробуем cargo check
    try {
      console.log('Trying cargo check to update Cargo.lock...');

      const cleanEnv = {
        HOME: process.env.HOME,
        USER: process.env.USER,
        PATH: `${process.env.HOME}/.cargo/bin:/usr/local/bin:/usr/bin:/bin`,
        LANG: process.env.LANG || 'en_US.UTF-8',
        LC_ALL: process.env.LC_ALL || 'en_US.UTF-8'
      };

      execSync('cargo check', {
        cwd: join(rootDir, 'src-tauri'),
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        env: cleanEnv
      });
      console.log('✅ Updated Cargo.lock via cargo check');
    } catch (checkError) {
      console.warn('⚠️  Could not update Cargo.lock automatically');
      console.warn('   This is not critical, but Cargo.lock might be out of sync');
      console.warn('   You can manually run: cd src-tauri && cargo update');
    }
  }
}

/**
 * Коммитит изменения версий
 */
function commitVersionChanges(version) {
  try {
    execGit('git add package.json src-tauri/Cargo.toml src-tauri/Cargo.lock src-tauri/tauri.conf.json');
    execGit(`git commit -m "chore: bump version to v${version}"`);
    console.log(`✅ Committed version changes`);
  } catch (error) {
    throw new Error(`Failed to commit version changes: ${error.message}`);
  }
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

  // Отправляем коммит и тег с переменной окружения для пропуска pre-push хуков
  try {
    console.log('📤 Pushing commits (skipping pre-push hooks)...');
    execSync('git push origin HEAD', {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: 'inherit',
      env: { ...process.env, SKIP_PRE_PUSH: '1' }
    });
    console.log(`✅ Pushed commits`);

    console.log('📤 Pushing tag (skipping pre-push hooks)...');
    const pushCommand = force
      ? `git push origin ${tagName} --force`
      : `git push origin ${tagName}`;

    execSync(pushCommand, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: 'inherit',
      env: { ...process.env, SKIP_PRE_PUSH: '1' }
    });
    console.log(`✅ Pushed tag: ${tagName}`);
  } catch (error) {
    throw new Error(`Failed to push: ${error.message}`);
  }

  return tagName;
}

/**
 * Выполняет pre-push проверки
 */
function runPrePushChecks() {
  try {
    console.log('🔍 Running pre-push checks...');
    execSync('pnpm pre-push', {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: 'inherit'
    });
    console.log('✅ Pre-push checks passed');
  } catch (error) {
    throw new Error(`Pre-push checks failed: ${error.message}`);
  }
}

/**
 * Основная функция
 */
function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');
  const releaseType = args.find(arg => ['major', 'minor', 'patch', 'prerelease'].includes(arg)) || 'patch';

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node release.js [patch|minor|major|prerelease] [--force]');
    console.log('');
    console.log('Creates a complete release: updates version, commits changes, creates and pushes tag');
    console.log('');
    console.log('Arguments:');
    console.log('  patch        Increment patch version (default)');
    console.log('  minor        Increment minor version');
    console.log('  major        Increment major version');
    console.log('  prerelease   Increment prerelease version');
    console.log('');
    console.log('Options:');
    console.log('  --force, -f  Overwrite existing tag');
    console.log('  --help, -h   Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  pnpm version:release           # patch release');
    console.log('  pnpm version:release minor     # minor release');
    console.log('  pnpm version:release major     # major release');
    process.exit(0);
  }

  try {
    // Проверяем рабочую директорию
    const workingDirStatus = checkWorkingDirectory();

    if (!workingDirStatus.clean && !workingDirStatus.hasVersionChanges) {
      console.error('❌ You have uncommitted changes in your working directory.');
      console.error('   Please commit or stash them before creating a release.');
      console.error('');
      console.error('Uncommitted files:');
      workingDirStatus.allChanges.forEach(change => {
        console.error(`   ${change}`);
      });
      process.exit(1);
    }

    // Читаем текущие версии
    const packageJson = readPackageJson();
    const cargoContent = readCargoToml();
    const tauriConf = readTauriConf();
    const currentVersion = packageJson.version;

    console.log(`Current version: ${currentVersion}`);
    console.log(`Release type: ${releaseType}`);

    // Вычисляем новую версию
    const newVersion = updateVersion(currentVersion, releaseType);
    console.log(`New version: ${newVersion}`);

    // Проверяем, существует ли тег
    const tagName = `v${newVersion}`;
    if (tagExists(tagName) && !force) {
      console.error(`❌ Tag ${tagName} already exists.`);
      console.error('   Use --force to overwrite or choose a different version.');
      process.exit(1);
    }

    // Выполняем pre-push проверки
    runPrePushChecks();

    // Обновляем файлы версий
    packageJson.version = newVersion;
    writePackageJson(packageJson);
    console.log('✅ Updated package.json');

    writeCargoToml(cargoContent, newVersion);
    console.log('✅ Updated src-tauri/Cargo.toml');

    tauriConf.version = newVersion;
    writeTauriConf(tauriConf);
    console.log('✅ Updated src-tauri/tauri.conf.json');

    // Обновляем Cargo.lock
    updateCargoLock();

    // Коммитим изменения
    commitVersionChanges(newVersion);

    // Создаем и отправляем тег
    createAndPushTag(newVersion, force);

    console.log('');
    console.log(`🎉 Successfully released version ${newVersion}!`);
    console.log('');
    console.log('What happened:');
    console.log(`1. ✅ Updated version from ${currentVersion} to ${newVersion}`);
    console.log('2. ✅ Updated package.json and Cargo.toml');
    console.log('3. ✅ Updated tauri.conf.json');
    console.log('4. ✅ Updated Cargo.lock');
    console.log('5. ✅ Committed version changes with message "chore: bump version to v' + newVersion + '"');
    console.log(`6. ✅ Created and pushed tag ${tagName}`);
    console.log('');
    console.log('GitHub Actions will now:');
    console.log('- Build the application for all platforms');
    console.log('- Create a GitHub Release');
    console.log('- Attach build artifacts to the release');
    console.log('');
    console.log(`View the release at: https://github.com/ikloster03/snowflake-desktop/releases/tag/${tagName}`);

  } catch (error) {
    console.error('❌ Error creating release:', error.message);
    process.exit(1);
  }
}

main();
