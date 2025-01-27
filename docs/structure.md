# Структура проекта

[Назад к README](readme.md)

## Структура модулей

```mermaid
graph TD
    A[Book Editor] --> B[Modules]
    B --> C[Book Module]
    B --> D[Projection Module]

    C --> C1[Author Management]
    C --> C2[Book Management]
    C --> C3[Series Management]
    C --> C4[Synopsis]

    D --> D1[Plan]
    D --> D2[Character Map]

    C2 --> C2_1[Single Book]
    C2 --> C2_2[Book in Series]

    C3 --> C3_1[Dilogy]
    C3 --> C3_2[Trilogy]
    C3 --> C3_3[Other Series Types]
```

## Типы связей между книгами

```mermaid
graph LR
    A[Book] --> B[Sequel]
    A --> C[Prequel]
    A --> D[Spin-off]
    A --> E[Side Story]
    A --> F[Adaptation]
    A --> G[Remake]
    A --> H[Alternative]
```

## Структура данных книги

```mermaid
classDiagram
    class Book {
        +string id
        +string title
        +string description
        +Author[] authors
        +string publicationDate
        +number pages
        +ISBN isbn
        +BookGenre[] genres
        +BookStatus status
        +BookRelation[] relations
    }

    class Author {
        +string id
        +string firstName
        +string middleName
        +string lastName
        +string titleName
    }

    class BookSeries {
        +string id
        +string title
        +string description
        +Author[] authors
        +BookInSeries[] books
        +SeriesType type
    }

    Book --> Author
    BookSeries --> Author
    BookSeries --> Book
```
