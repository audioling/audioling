// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri_plugin_shell::ShellExt;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            let sidecar_command = app.shell().sidecar("audioling-server").unwrap();
            let (_rx, _child) = sidecar_command
                .env("NODE_ENV", "production")
                .spawn()
                .expect("Failed to spawn audioling-server");

            Ok(())
        })
        .on_window_event(|_event_window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                #[cfg(target_os = "windows")]
                {
                    use std::process::Command;
                    use std::os::windows::process::CommandExt;

                    const CREATE_NO_WINDOW: u32 = 0x08000000;
                    Command::new("taskkill")
                        .args(["/F", "/IM", "audioling-server.exe"])
                        .creation_flags(CREATE_NO_WINDOW)
                        .output()
                        .expect("Failed to kill audioling-server process");
                }

                #[cfg(not(target_os = "windows"))]
                {
                    use std::process::Command;
                    Command::new("pkill")
                        .arg("audioling-server")
                        .output()
                        .expect("Failed to kill audioling-server process");
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
