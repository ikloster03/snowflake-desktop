// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// mod project;

use tauri::menu::{Menu, MenuBuilder, MenuItemBuilder, PredefinedMenuItem, SubmenuBuilder};
use tauri::{AppHandle, Runtime};

// use project::{create_project, open_project};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

pub fn create_menu<R: Runtime>(app: &AppHandle<R>) -> Result<Menu<R>, tauri::Error> {
    let app_menu = SubmenuBuilder::new(app, "Snowflake")
        .item(&PredefinedMenuItem::about(app, None, None)?)
        .item(&MenuItemBuilder::with_id("check_for_update", "Check for Update").build(app)?)
        .separator()
        .item(&PredefinedMenuItem::hide(app, None).unwrap())
        .item(&PredefinedMenuItem::hide_others(app, None).unwrap())
        .item(&PredefinedMenuItem::show_all(app, None).unwrap())
        .separator()
        .item(&PredefinedMenuItem::quit(app, None)?)
        .build()?;

    let edit_menu = SubmenuBuilder::new(app, "Edit")
        .item(&PredefinedMenuItem::undo(app, None).unwrap())
        .item(&PredefinedMenuItem::redo(app, None).unwrap())
        .separator()
        .item(&PredefinedMenuItem::cut(app, None).unwrap())
        .item(&PredefinedMenuItem::copy(app, None).unwrap())
        .item(&PredefinedMenuItem::paste(app, None).unwrap())
        .item(&PredefinedMenuItem::select_all(app, None).unwrap())
        .build()?;

    let view_menu = SubmenuBuilder::new(app, "View")
        .item(&MenuItemBuilder::with_id("toggle_fullscreen", "Toggle Fullscreen").build(app)?)
        .build()?;

    let help_menu = SubmenuBuilder::new(app, "Help")
        .item(&MenuItemBuilder::with_id("report_issue", "Report Issue").build(app)?)
        .separator()
        // Add the new menu item for checking updates
        .item(&MenuItemBuilder::with_id("check_for_update", "Check for Update").build(app)?)
        .separator()
        .item(&PredefinedMenuItem::about(app, None, None)?)
        .build()?;

    let menu = MenuBuilder::new(app)
        .item(&app_menu)
        .item(&edit_menu)
        .item(&view_menu)
        .item(&help_menu)
        .build()?;

    Ok(menu)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        // .setup(|app| {
        //     let menu = create_menu(&app.handle())?;
        //     app.set_menu(menu)?;
        //     Ok(())
        // })
        .plugin(tauri_plugin_opener::init())
        // .invoke_handler(tauri::generate_handler![
        //     create_project,
        //     open_project,
        // ])
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
