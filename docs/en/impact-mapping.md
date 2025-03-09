# Impact Mapping

## Overview

Impact mapping is a strategic planning tool that helps the team focus on business goals and determine how various actions affect the achievement of these goals. For the Snowflake Desktop project, the impact map shows the relationship between business goals, stakeholders, their behavior, and specific application features.

## Impact Map Structure

```mermaid
mindmap
  root((Snowflake Desktop))
    Why?
      Increase writer productivity
      Improve creative process organization
      Lower the barrier to entry for writing activities
      Create a convenient tool for managing literary projects
    Who?
      Novice writers
      Professional authors
      Screenwriters
      Editors
      Amateur writers
    How?
      Simplify book structuring
      Visualize character relationships
      Organize work with locations
      Track writing progress
      Ensure secure data storage
      Provide convenient export to various formats
    What?
      Project management module
      Book management module
      Projection and planning module
      Content management module
      Export and save system
      Improved user interface
```

## Impact Map Details

### 1. Why? (Business Goals)

| Goal                                                    | Success Metric                                 | Target Value            |
| ------------------------------------------------------- | ---------------------------------------------- | ----------------------- |
| Increase writer productivity                            | Average number of words written per day        | 30% increase            |
| Improve creative process organization                   | Time spent on planning                         | 40% reduction           |
| Lower the barrier to entry for writing activities       | Number of completed projects by novice authors | 50% increase            |
| Create a convenient tool for managing literary projects | User satisfaction                              | Rating of 4.5+ out of 5 |

### 2. Who? (Stakeholders)

| Stakeholder          | Needs                                            | Pain Points                                              |
| -------------------- | ------------------------------------------------ | -------------------------------------------------------- |
| Novice writers       | Ease of use, educational materials               | Difficulty structuring ideas, uncertainty in the process |
| Professional authors | Flexibility, advanced features, reliability      | Time lost on organization, risk of data loss             |
| Screenwriters        | Visualization of story arcs, work with dialogues | Difficulty tracking multiple storylines                  |
| Editors              | Ability to comment, track changes                | Inefficient communication with authors                   |
| Amateur writers      | Accessibility, basic functions                   | Lack of motivation, misunderstanding of the process      |

### 3. How? (Behavior Changes)

| Behavior Change                   | Impact on Goal                                | Metric                                         |
| --------------------------------- | --------------------------------------------- | ---------------------------------------------- |
| Simplify book structuring         | Increased productivity, improved organization | Time spent on planning structure               |
| Visualize character relationships | Improved organization, lower barrier to entry | Number of characters and relationships created |
| Organize work with locations      | Improved creative process organization        | Time spent searching for location information  |
| Track writing progress            | Increased productivity, motivation            | Regularity of application use                  |
| Ensure secure data storage        | Creating a convenient tool                    | Amount of lost data (tends to zero)            |
| Provide convenient export         | Increased productivity                        | Time spent preparing materials                 |

### 4. What? (Functionality)

| Functionality                  | Impact on Behavior                                | Priority |
| ------------------------------ | ------------------------------------------------- | -------- |
| Project management module      | Work organization, secure storage                 | High     |
| Book management module         | Book structuring                                  | High     |
| Projection and planning module | Progress tracking, structuring                    | Medium   |
| Content management module      | Relationship visualization, location organization | Medium   |
| Export and save system         | Secure storage, convenient export                 | High     |
| Improved user interface        | All behavior changes                              | High     |

## Extended Impact Map by Modules

```mermaid
graph TD
    A[Snowflake Desktop] --> B[Project management module]
    A --> C[Book management module]
    A --> D[Projection and planning module]
    A --> E[Content management module]

    B --> B1[Project creation]
    B --> B2[Auto-save]
    B --> B3[Backups]

    C --> C1[Book management]
    C --> C2[Series management]
    C --> C3[Author management]

    D --> D1[Book plan]
    D --> D2[Timeline]
    D --> D3[Character map]

    E --> E1[Characters]
    E --> E2[Locations]
    E --> E3[Artifacts]
    E --> E4[Events]

    B1 --> F1[Novice writers]
    B2 --> F2[Professional authors]
    B3 --> F2

    C1 --> F1
    C1 --> F2
    C2 --> F2
    C3 --> F2

    D1 --> F1
    D1 --> F2
    D2 --> F3[Screenwriters]
    D3 --> F1
    D3 --> F3

    E1 --> F1
    E1 --> F2
    E1 --> F3
    E2 --> F2
    E2 --> F3
    E3 --> F2
    E4 --> F3
```

## Key Findings

1. **Focus on user experience**: The most important aspect is creating an intuitive interface that will be accessible to both beginners and experienced writers.

2. **Data security priority**: Ensuring reliable storage and backup is critical for all user groups.

3. **Balance of simplicity and functionality**: It is necessary to find a balance between ease of use for beginners and advanced features for professionals.

4. **Phased implementation**: It is recommended to start with basic modules (project and book management) and gradually add more complex features.

5. **Feedback**: It is important to regularly collect feedback from users to adjust the direction of product development.

## Implementation Recommendations

1. **MVP (Minimum Viable Product)**: Focus on the project management module and basic functions of the book management module.

2. **Second stage**: Add export functions and improve the user interface based on feedback.

3. **Third stage**: Implement projection and content management modules.

4. **Fourth stage**: Add advanced features for professional users and integration with other services.
