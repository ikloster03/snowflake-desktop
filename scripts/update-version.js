#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import semver from 'semver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const PACKAGE_JSON_PATH = join(rootDir, 'package.json');
const CARGO_TOML_PATH = join(rootDir, 'src-tauri', 'Cargo.toml');

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
 * Основная функция
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node update-version.js <patch|minor|major|prerelease>');
    console.log('');
    console.log('Examples:');
    console.log('  pnpm version:patch     # 1.0.0 -> 1.0.1');
    console.log('  pnpm version:minor     # 1.0.0 -> 1.1.0');
    console.log('  pnpm version:major     # 1.0.0 -> 2.0.0');
    console.log('  pnpm version:prerelease # 1.0.0 -> 1.0.1-0');
    process.exit(1);
  }

  const releaseType = args[0];

  try {
    // Читаем текущие версии
    const packageJson = readPackageJson();
    const cargoContent = readCargoToml();
    const currentVersion = packageJson.version;

    console.log(`Current version: ${currentVersion}`);

    // Вычисляем новую версию
    const newVersion = updateVersion(currentVersion, releaseType);
    console.log(`New version: ${newVersion}`);

    // Обновляем package.json
    packageJson.version = newVersion;
    writePackageJson(packageJson);
    console.log('✅ Updated package.json');

    // Обновляем Cargo.toml
    writeCargoToml(cargoContent, newVersion);
    console.log('✅ Updated src-tauri/Cargo.toml');

    console.log('');
    console.log(`🎉 Version updated from ${currentVersion} to ${newVersion}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Review the changes');
    console.log('2. Commit the version bump');
    console.log('3. Create and push a tag:');
    console.log(`   git tag v${newVersion}`);
    console.log(`   git push origin v${newVersion}`);

  } catch (error) {
    console.error('❌ Error updating version:', error.message);
    process.exit(1);
  }
}

main();
