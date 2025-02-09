// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use tauri::Manager;
use tauri_plugin_shell::{process::CommandChild, ShellExt};

struct ApplicationState {
    server_process: Option<CommandChild>,
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            let sidecar_command = app.shell().sidecar("audioling-server").unwrap();
            let (_rx, child) = sidecar_command
                .env("NODE_ENV", "production")
                .spawn()
                .expect("Failed to spawn audioling-server");
            app.manage(Mutex::new(ApplicationState {
                server_process: Some(child),
            }));
            Ok(())
        })
        .on_window_event(|event_window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                if let Ok(mut state) = event_window
                    .app_handle()
                    .state::<Mutex<ApplicationState>>()
                    .lock()
                {
                    let child = state.server_process.take();
                    if let Some(child) = child {
                        if let Err(e) = child.kill() {
                            eprintln!("failed to kill server: {e}");
                        } else {
                            println!("killed server");
                        }
                    }
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
