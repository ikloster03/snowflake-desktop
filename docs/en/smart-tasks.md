# Technical Tasks Using SMART Methodology

## 1. Book and Series Management

### Task 1.1: Development of Book Creation Component

**S**: Develop a Vue3 component form for book creation with fields: title, description, genre, ISBN.  
**M**: The component must include validation for all fields, storage in the store, and display in the book list.  
**A**: Use Naive UI for UI components, Pinia for data storage, Tauri API for file system interaction.  
**R**: Necessary for basic book management functionality.  
**T**: Complete within 3 working days.

### Task 1.2: Implementation of Data Storage for Books

**S**: Create a book data storage module using Pinia and integration with the Tauri API.  
**M**: The module must support CRUD operations, saving to JSON files, and loading from them.  
**A**: Use TypeScript for typing, Tauri API for file operations.  
**R**: Necessary for persistent storage of book data.  
**T**: Complete within 2 working days.

### Task 1.3: Development of Series Management Component

**S**: Create a Vue3 component for managing book series with the ability to add/remove books and sort them.  
**M**: The component must support all types of series, drag-and-drop for sorting, and display a list of series.  
**A**: Use Naive UI, Vue Draggable for drag-and-drop, Pinia for storage.  
**R**: Necessary for grouping books into series.  
**T**: Complete within 4 working days.

### Task 1.4: Implementation of Book Relations System

**S**: Develop a module and UI for creating and visualizing connections between books.  
**M**: The system must support all types of connections, prevent cyclic connections, and visualize connections in graph form.  
**A**: Use D3.js or Cytoscape.js library for visualization, Pinia for storage.  
**R**: Necessary for tracking relationships between books.  
**T**: Complete within 5 working days.

## 2. Character Management

### Task 2.1: Development of Character Card Component

**S**: Create a Vue3 component for creating and editing a character card.  
**M**: The component must include all basic fields, image uploads, tags/labels, search.  
**A**: Use Naive UI, Tauri API for file operations, Pinia for storage.  
**R**: Necessary for managing characters in books.  
**T**: Complete within 4 working days.

### Task 2.2: Implementation of Character Relationship Visualization

**S**: Develop a component for visualizing and managing relationships between characters.  
**M**: The component must support creating relationships, relationship types, graph interactivity, and schema export.  
**A**: Use D3.js or Cytoscape.js, Pinia for storage, Tauri API for export.  
**R**: Necessary for managing character relationships.  
**T**: Complete within 6 working days.

### Task 2.3: Development of Character Levels System

**S**: Create a module and UI for grouping characters by significance levels.  
**M**: The system must support level assignment, filtering, hierarchy display, and statistics.  
**A**: Use Naive UI, Pinia for storage, TypeScript for typing.  
**R**: Necessary for structuring characters by importance.  
**T**: Complete within 3 working days.

## 3. Plot Management

### Task 3.1: Development of Book Structure Component

**S**: Create a Vue3 component for managing book structure (chapters, scenes).  
**M**: The component must support hierarchical display, drag-and-drop, numbering, import/export.  
**A**: Use Naive UI, Vue Draggable, Pinia for storage, Tauri API for import/export.  
**R**: Necessary for planning book structure.  
**T**: Complete within 5 working days.

### Task 3.2: Implementation of Scene Status System

**S**: Develop a module and UI for managing scene statuses.  
**M**: The system must support status changes, writing progress, statistics, filtering, and notifications.  
**A**: Use Naive UI, Pinia for storage, TypeScript for typing.  
**R**: Necessary for tracking book writing progress.  
**T**: Complete within 3 working days.

### Task 3.3: Development of Timeline Events Component

**S**: Create a Vue3 component for visualizing and managing a timeline of events.  
**M**: The component must support adding events, binding to scenes, scaling, grouping, and parallel lines.  
**A**: Use a specialized library (vis-timeline), Pinia for storage, TypeScript for typing.  
**R**: Necessary for planning the chronology of events in the book.  
**T**: Complete within 7 working days.

## 4. Location System

### Task 4.1: Development of Location Creation Component

**S**: Create a Vue3 component for creating and editing locations.  
**M**: The component must include description fields, image uploads, tags/labels, search.  
**A**: Use Naive UI, Tauri API for file operations, Pinia for storage.  
**R**: Necessary for managing book settings and places.  
**T**: Complete within 4 working days.

### Task 4.2: Implementation of Location Hierarchy

**S**: Develop a module and UI for building and displaying a location hierarchy.  
**M**: The system must support nesting, tree display, drag-and-drop, and quick navigation.  
**A**: Use Naive UI Tree, Vue Draggable, Pinia for storage.  
**R**: Necessary for structuring locations.  
**T**: Complete within 3 working days.

### Task 4.3: Development of World Map Editor

**S**: Create a component for creating and editing a world map with location placement.  
**M**: The component must support placing locations, scaling, layers, and export/import.  
**A**: Use the Leaflet or OpenLayers library, Tauri API for file operations, Pinia for storage.  
**R**: Necessary for visualizing the book's world.  
**T**: Complete within 8 working days.

## 5. Export and Saving

### Task 5.1: Implementation of DOCX Export

**S**: Develop a module for exporting a book to DOCX format while preserving formatting.  
**M**: The module must support all formatting elements, automatic table of contents, style customization.  
**A**: Use the docx library or PizZip + docxtemplater, Tauri API for file operations.  
**R**: Necessary for exporting the book to an editable format.  
**T**: Complete within 5 working days.

### Task 5.2: Implementation of Backup System

**S**: Develop a module for creating and restoring project backups.  
**M**: The system must support auto-saving every 5 minutes, versioning, restoration, cloud storage.  
**A**: Use Tauri API for file operations, JSZip library for archiving.  
**R**: Necessary for protection against data loss.  
**T**: Complete within 4 working days.

### Task 5.3: Implementation of .snflk Format

**S**: Develop a module for saving and loading projects in .snflk format.  
**M**: The module must support data compression, metadata, validation, encryption.  
**A**: Use Tauri API for file operations, JSZip library for archiving, crypto-js for encryption.  
**R**: Necessary for project portability.  
**T**: Complete within 5 working days.

## 6. UX Improvements

### Task 6.1: Development of Navigation System

**S**: Create components for application navigation (sidebar, breadcrumbs, search).  
**M**: The system must provide access to any section in ≤3 clicks, quick search, transition history, bookmarks.  
**A**: Use Vue Router, Naive UI, Pinia for state storage.  
**R**: Necessary for convenient navigation through the application.  
**T**: Complete within 4 working days.

### Task 6.2: Implementation of Drag-and-Drop Interface

**S**: Implement drag-and-drop functionality in all lists and components where applicable.  
**M**: The functionality must support sorting, moving between lists, visual feedback, and action cancellation.  
**A**: Use Vue Draggable, integration with Pinia to save changes.  
**R**: Necessary for intuitive element management.  
**T**: Complete within 6 working days.

### Task 6.3: Development of Notification System

**S**: Create a module and UI for displaying and managing notifications.  
**M**: The system must support different notification types, settings, history, actions, grouping.  
**A**: Use Naive UI Notification, Pinia for storage, TypeScript for typing.  
**R**: Necessary for informing the user about important events.  
**T**: Complete within 3 working days.

## 7. Integration and Testing

### Task 7.1: Development of Tests for Core Components

**S**: Create a test suite for all key application components.  
**M**: Tests must cover at least 80% of the code, including unit tests and integration tests.  
**A**: Use Vitest, Vue Testing Library, Mock Service Worker for API mocking.  
**R**: Necessary for ensuring application quality and stability.  
**T**: Complete within 7 working days.

### Task 7.2: Performance Optimization

**S**: Conduct profiling and optimize application performance.  
**M**: Response time must be <200ms, memory usage within normal limits, stable operation under maximum load.  
**A**: Use Vue DevTools, Chrome Performance Tools, optimize component rendering.  
**R**: Necessary for ensuring smooth application operation.  
**T**: Complete within 5 working days.

### Task 7.3: Interface Localization

**S**: Implement interface localization in Russian and English.  
**M**: All interface texts must be localized, support language switching, and saving the selection.  
**A**: Use Vue I18n, JSON files for storing translations, Pinia for saving settings.  
**R**: Necessary for multilingual support.  
**T**: Complete within 4 working days.
