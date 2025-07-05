# Snowflake Desktop

**[🇷🇺 Русский](README.md)** | **🇺🇸 English**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Version](https://img.shields.io/github/v/release/ikloster03/snowflake-desktop)](https://github.com/ikloster03/snowflake-desktop/releases) [![Status](https://img.shields.io/badge/status-v1%20development-green.svg)](https://snowflake.ikloster.tech)

Book manager for writers. Created to make you exceptionally productive.

🌐 **[Official Website](https://snowflake.ikloster.tech/en)** | 📥 **[Download](https://snowflake.ikloster.tech/en/downloads)** | 📖 **[Documentation](https://snowflake.ikloster.tech/en/user-guide)**

## Description

Snowflake Desktop is a powerful desktop application for writers that helps organize the book creation process. The application provides all the necessary tools for plot planning, character management, progress tracking, and creating detailed lore for your work.

The application is built on modern technologies: **Tauri** for the desktop part with **Rust** backend and **Vue 3** + **TypeScript** for the frontend, ensuring high performance and native integration with the operating system.

## Features

### 📖 Project and Book Management
- Creating and organizing projects
- Managing book metadata (genre, status, target audience)
- Local data storage with complete privacy

### 🌍 Book Lore Management
- **Characters**: Creating detailed profiles with biography, appearance, and story role
- **Places**: Location descriptions with atmosphere, features, and connections
- **Items**: Catalog of objects, artifacts, and their history
- **Events**: Timeline of important events with participants and consequences
- **Interactive Lore Map**: Visualization of all connections between elements

### ✍️ Plot Planning
- Creating book structure by chapters
- Managing scenes within chapters
- Text editor with auto-save every 30 seconds
- Word count tracking and work status

### 💾 Export and Saving
- Automatic project saving
- Export to DOCX format with formatting preservation
- Backup creation capability

### 🔧 Additional Features
- Fully offline operation
- Optimization for large projects
- Intuitive interface for maximum productivity
- Cross-platform support (Windows, Linux)

## Installation

### Download Ready Application

Go to the [downloads page](https://snowflake.ikloster.tech/en/downloads) and download the version for your operating system:

- **Windows**: `.exe` or `.msi` installer
- **Linux**: `.AppImage`, `.deb`, or `.rpm` package
- **macOS**: `.dmg` image (planned)

### System Requirements

- **Windows**: Windows 10 or newer, 64-bit
- **Linux**: Ubuntu 20.04 or newer, 64-bit
- **Memory**: 4 GB RAM
- **Disk Space**: 100 MB free space

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [pnpm](https://pnpm.io/) (recommended package manager)
- [Rust](https://rustup.rs/) (for Tauri)

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ikloster03/snowflake-desktop.git
   cd snowflake-desktop
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Setup Git hooks:**
   ```bash
   npx simple-git-hooks
   ```

   > **Note for Windows**: If you encounter PowerShell errors, run:
   > ```powershell
   > Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   > ```

### Running in Development Mode

```bash
# Web version (for quick UI development)
pnpm dev:web

# Desktop version (Tauri)
pnpm dev:desktop
```

### Building the Project

```bash
# Web version
pnpm build:web

# Desktop version
pnpm build:desktop
```

### Testing and Quality Assurance

```bash
# TypeScript type checking
pnpm type-check

# Linting with enhanced formatting
pnpm lint:types

# Run tests
pnpm test

# Tests with code coverage
pnpm test:coverage

# Tests with UI interface
pnpm test:ui
```

### Working with Documentation

```bash
# Documentation development
pnpm docs:dev

# Documentation build
pnpm docs:build

# Documentation preview
pnpm docs:preview
```

### Git Hooks

The project has automatic checks configured:

- **commit-msg**: Checks commit message compliance with [Conventional Commits](https://www.conventionalcommits.org/) rules
- **pre-push**: Runs type checking and tests before pushing changes

### Project Architecture

```
snowflake-desktop/
├── src/                    # Frontend source code (Vue 3 + TypeScript)
│   ├── core/              # Core modules
│   └── modules/           # Functional modules
├── src-tauri/             # Backend source code (Rust)
├── docs/                  # Project documentation
└── tests/                 # Tests
```

## Useful Links

- 🌐 [Official Website](https://snowflake.ikloster.tech/en)
- 📥 [Download Application](https://snowflake.ikloster.tech/en/downloads)
- 📖 [User Guide](https://snowflake.ikloster.tech/en/user-guide)
- 🗺️ [Roadmap](https://snowflake.ikloster.tech/en/roadmap)
- 🐛 [Report Bug](https://github.com/ikloster03/snowflake-desktop/issues)
- 💬 [Discussions](https://github.com/ikloster03/snowflake-desktop/discussions)
- 📱 [Telegram Group](https://t.me/snowflake_desktop)

## License

This project is distributed under the MIT License. See [LICENSE](LICENSE) file for details.

## Development Status

> **Current Status**: v1.0 Development (MVP Completed)

The MVP version of the application is completed and fully functional. Currently, active development of version v1.0 is underway with main focus on:

- 🔧 **Improving application stability**
- 🐛 **Fixing discovered bugs**
- ⚡ **Performance optimization**
- 🔒 **Enhancing data saving reliability**
- 🎨 **Improving user experience**

All main features work, however some capabilities may work unstably. If you encounter problems, please create [issues](https://github.com/ikloster03/snowflake-desktop/issues) or report in our [Telegram group](https://t.me/snowflake_desktop).

---

**Created with ❤️ for writers** 
