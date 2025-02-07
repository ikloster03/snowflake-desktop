use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    id: String,
    name: String,
    description: String,
    path: String,
    created: String,
    updated: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectConfig {
    name: String,
    description: String,
    path: String,
}

#[tauri::command]
pub async fn create_project(config: ProjectConfig) -> Result<Project, String> {
    let project = Project {
        id: uuid::Uuid::new_v4().to_string(),
        name: config.name,
        description: config.description,
        path: config.path.clone(),
        created: Utc::now().to_rfc3339(),
        updated: Utc::now().to_rfc3339(),
    };

    // Создаем структуру папок проекта
    let project_path = Path::new(&config.path);
    create_project_structure(project_path).map_err(|e| e.to_string())?;

    // Сохраняем конфигурацию проекта
    let config_path = project_path.join("project.json");
    let config_json = serde_json::to_string_pretty(&project).map_err(|e| e.to_string())?;
    fs::write(config_path, config_json).map_err(|e| e.to_string())?;

    Ok(project)
}

#[tauri::command]
pub async fn open_project(path: String) -> Result<Project, String> {
    let project_path = Path::new(&path);
    let config_path = project_path.join("project.json");

    let config_content = fs::read_to_string(config_path).map_err(|e| e.to_string())?;
    let mut project: Project = serde_json::from_str(&config_content).map_err(|e| e.to_string())?;

    // Обновляем время последнего открытия
    project.updated = Utc::now().to_rfc3339();

    // Сохраняем обновленную конфигурацию
    let config_json = serde_json::to_string_pretty(&project).map_err(|e| e.to_string())?;
    fs::write(project_path.join("project.json"), config_json).map_err(|e| e.to_string())?;

    Ok(project)
}

fn create_project_structure(project_path: &Path) -> std::io::Result<()> {
    // Создаем основные директории
    fs::create_dir_all(project_path)?;
    fs::create_dir_all(project_path.join("books"))?;
    fs::create_dir_all(project_path.join("series"))?;
    fs::create_dir_all(project_path.join("authors"))?;
    fs::create_dir_all(project_path.join("lore"))?;
    fs::create_dir_all(project_path.join("media"))?;

    // Создаем поддиректории для lore
    fs::create_dir_all(project_path.join("lore/characters"))?;
    fs::create_dir_all(project_path.join("lore/locations"))?;
    fs::create_dir_all(project_path.join("lore/events"))?;
    fs::create_dir_all(project_path.join("lore/items"))?;

    Ok(())
}
