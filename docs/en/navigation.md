# Navigation

[Back to README](readme.md)

## Navigation Structure

```mermaid
graph LR
    A[Main Page] --> B[Book Editor]
    B --> C[New Book]
    B --> D[New Series]
    B --> E[New Author]
    C --> F[Synopsis]
    C --> G[Plan]
    C --> H[Character Map]
```

## Book Creation Process

```mermaid
sequenceDiagram
    participant U as User
    participant F as Form
    participant S as Store
    participant V as Validation

    U->>F: Fill Book Details
    F->>V: Validate Input
    V-->>F: Validation Result
    F->>S: Save Book
    S-->>F: Success/Error
    F-->>U: Show Message
```

## Additional Materials

- [Customer Journey Map](customer-journey-map.md) - visualization of the user's interaction process with the application
- [Impact Mapping](impact-mapping.md) - strategic planning tool showing the relationship between business goals and application features
