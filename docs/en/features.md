# Key Features of the Project

## Main Modules

### 1. Project Module (Project Management)

```mermaid
graph TD
    A[Project Module] --> B[Project Management]
    A --> C[Project Settings]
    A --> D[Project History]

    B --> B1[Creation]
    B --> B2[Opening]
    B --> B3[Export]
    B --> B4[Import]

    C --> C1[Auto-save]
    C --> C2[Backups]
    C --> C3[Localization]
```

- Creation and management of projects
- Auto-save every 5 minutes
- Backup system
- History of recent projects
- Export/import in .snflk format

### 2. Book Module (Book Management)

```mermaid
graph TD
    A[Book Module] --> B[Books]
    A --> C[Series]
    A --> D[Authors]

    B --> B1[Metadata]
    B --> B2[Synopsis]
    B --> B3[Annotation]

    C --> C1[Connections]
    C --> C2[Types of Series]

    D --> D1[Profiles]
    D --> D2[Portfolio]
```

- Management of books and series
- Creation of connections between books
- Management of authors and their portfolios
- Support for various types of series

### 3. Projection Module (Projections and Planning)

```mermaid
graph TD
    A[Projection Module] --> B[Plan]
    A --> C[Timeline]
    A --> D[Character Map]

    B --> B1[Chapters]
    B --> B2[Scenes]
    B --> B3[Statuses]

    C --> C1[Events]
    C --> C2[Connections]

    D --> D1[Relationships]
    D --> D2[Groups]
```

- Planning the structure of the book
- Management of chapters and scenes
- Timeline of events
- Character map and their connections

### 4. Lore Module (Content Management)

```mermaid
graph TD
    A[Lore Module] --> B[Characters]
    A --> C[Locations]
    A --> D[Artifacts]
    A --> E[Events]

    B --> B1[Profiles]
    B --> B2[Relationships]

    C --> C1[Descriptions]
    C --> C2[Connections]

    D --> D1[Descriptions]
    D --> D2[History]
```

- Management of characters and their profiles
- Creation and editing of locations
- Management of artifacts and items
- Description of events and their connections

## Technical Features

### Performance

- Response time < 200ms
- Optimized for large projects
- Efficient memory management

### Security

- Encryption of sensitive data
- Secure file storage
- Data loss protection

### User Experience

- Intuitive interface
- Support for dark theme
- Hotkeys
- Drag-and-drop interface

### Export Formats

- DOCX (with formatting preserved)
- PDF (with automatic table of contents)
- HTML (for web publication)
- .snflk (project format)

## Planned Features

### AI Integration

- Character name generation
- Assistance in creating descriptions
- Plot coherence analysis

### Collaboration

- Collaborative editing
- Comments and notes
- Versioning system

### Advanced Analytics

- Text statistics
- Character analysis
- Progress tracking
