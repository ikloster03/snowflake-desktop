# Current Application Features

## Project Management

- Creating new projects
- Opening existing projects
- Closing projects
- Tracking recently opened projects
- Changing project type (single book/series)
  - Automatic type change validation
  - Warning when type change is not possible
  - Automatic saving after type change

## Book Editor

- Book Management
  - Adding new books
  - Viewing book list
  - Editing books through a dedicated editor interface
  - Deleting books
- Book Series Management
  - Adding new series
  - Viewing series list
  - Editing series through a dedicated editor interface
  - Managing book order within series
  - Deleting series
- Author Management
  - Adding new authors
  - Viewing author list
  - Editing authors
  - Deleting authors
- Linking books with authors and series
- Displaying books related to specific authors or series

## Lore Editor

- Character Management
  - Creating new characters
  - Viewing character list
  - Editing character information
  - Deleting characters
- Location Management
  - Creating new locations
  - Viewing location list
  - Editing location information
  - Deleting locations
- Modules for managing world items and events
- Functionality for creating world maps

## Projections

- Timeline
  - Visualization of event chronology
  - Placing events on the timeline
  - Managing scale and navigation
- Character Map
  - Visual representation of character relationships
  - Creating and editing relationships
  - Customizing display and legend
- Chapter, Scene, and Stage Planning
  - Creating and editing chapters for books
  - Selecting and switching between books via dropdown
  - Creating and editing scenes within chapters
  - Chapter text editor with automatic saving
  - Reactive content updates when switching between books
  - Organizing chapters in a hierarchical structure
- Scene Management
  - Creating and editing scenes
  - Linking scenes to chapters
  - Adding characters, locations, events, and items to scenes
  - Tracking scene status (draft, in progress, completed)
  - Searching scenes by title and description
  - Linking scenes with timeline and events
  - Ability to share scenes between books in a series
- Other visual tools for plot planning

## Application Settings

- Interface theme management (light/dark)
- Interface language selection
  - Automatic system language detection
  - Support for Russian and English languages
- Date and number format settings
- Saving settings for each project

## Data Storage

- Data stored in JSON files in the project directory
  - books.json for books
  - series.json for series
  - authors.json for authors
  - characters.json for characters
  - locations.json for locations
  - timeline.json for timeline
  - character-map.json for character map
  - settings.json for project settings
  - books/ directory for storing each book's data:
    - Subdirectory for each book by its ID
    - chapters.json for specific book chapters
    - text/ subdirectory for storing chapter text content
  - stages.json for scenes (shared across series or linked to specific chapters)
  - and other files for various lore elements
- Book data storage structure:
  - Authors stored at project level and can be shared across series
  - Scenes linked to chapters via ID and stored at project level
  - Scenes can be linked to series for shared use between books
  - Chapters and chapter texts stored in separate directories for each book
- Automatic saving when data changes
- Reactive interface updates when data changes

## User Interface

- Interactive lists for books, series, authors, characters, locations, and other elements
- Modal windows for creating and editing entities
- Tabs for navigation between different editor sections
- Deletion confirmation to prevent accidental operations
- Form validation
- Interactive visual tools (timeline, character map)
- Drag-and-drop support in visual tools
- Adaptive theme (light/dark) with toggle option
- Notification system for important actions and errors
- Tabular interface for scene management with filtering and search
- Status indication for scene work progress
- Integration between modules (linking scenes with chapters, characters, locations, and events)

## Architectural Features

- Using Pinia for state management
  - Private stores for internal logic
  - Public stores with computed properties for reactivity
  - Watchers for reactive component updates when data changes
- Multilingual interface (support for Russian and English)
- Component-based approach using Vue 3 Composition API
- Asynchronous data loading with loading indicators
- Tauri for native file system access

## Limitations

- Maximum number of books, series, and authors limited by project settings
- Validation checks when creating new elements
- Limitation on creating duplicate entities with identical identifiers
- Inability to change project type from "series" to "single book" when more than one book exists

## Current Version Limitations

### Known Limitations

- **Performance Limitations**
  - Slower performance with projects containing more than 100 characters
  - Reduced interface responsiveness when working with texts over 50,000 words
  - Limitation on the number of simultaneously displayed elements in Timeline (up to 200)
- **Functional Limitations**
  - Lack of a full-featured collaboration system
  - Limited text formatting capabilities in the editor
  - No built-in spelling and grammar checking system
  - Limited media file support (only JPG, PNG images)
- **Interface Limitations**
  - Inability to view multiple scenes/chapters simultaneously
  - Limited interface appearance customization
  - No mobile version of the application

## Component Development Status

### Project Module

- **Status: 85% complete**
- **Completed Components:**
  - Project creation and opening
  - Project settings management
  - Recent projects history
  - Basic project export
- **In Development:**
  - Enhanced backup system
  - Extended export options
  - Templates for new projects

### Book Module

- **Status: 90% complete**
- **Completed Components:**
  - Book and metadata management
  - Series and book relationship management
  - Author management
  - Annotations and synopses
- **In Development:**
  - Extended metadata system
  - Enhanced book cover management
  - Advanced book relationship system

### Projection Module

- **Status: 75% complete**
- **Completed Components:**
  - Chapter and scene management
  - Basic timeline
  - Scene status management
- **In Development:**
  - Enhanced timeline visualization
  - Advanced plot planning tools
  - Integration with other modules
  - Extended filtering and search system

### Lore Module

- **Status: 70% complete**
- **Completed Components:**
  - Character management
  - Location management
  - Basic character relationship map
- **In Development:**
  - Enhanced world map
  - Extended character attribute system
  - Item and artifact management
  - Event and relationship system

### Export Module

- **Status: 60% complete**
- **Completed Components:**
  - Basic DOCX export
  - Project export and import in .snflk format
- **In Development:**
  - PDF export with advanced formatting
  - Lore materials export to HTML
  - Customizable export templates
  - Character map and timeline export to graphic formats

### UI/UX

- **Status: 80% complete**
- **Completed Components:**
  - Core interface components
  - Theme system (light/dark)
  - Internationalization (EN/RU)
  - Basic notification system
- **In Development:**
  - Enhanced notification system
  - Extended interface customization options
  - Optimization for various screen resolutions
  - Improved accessibility
