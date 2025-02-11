# audioling

  <p align="center">
    <a href="https://github.com/audioling/audioling/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/audioling/audioling?style=flat-square&color=brightgreen"
      alt="License">
    </a>
    <a href="https://github.com/audioling/audioling/releases">
      <img src="https://img.shields.io/github/v/release/audioling/audioling?style=flat-square&color=blue"
      alt="Release">
    </a>
    <a href="https://github.com/audioling/audioling/releases">
      <img src="https://img.shields.io/github/downloads/audioling/audioling/total?style=flat-square&color=orange"
      alt="Downloads">
    </a>
  </p>
  <p align="center">
    <a href="https://discord.gg/FVKpcMDy5f">
      <img src="https://img.shields.io/discord/922656312888811530?color=black&label=discord&logo=discord&logoColor=white"
      alt="Discord">
    </a>
    <a href="https://matrix.to/#/#sonixd:matrix.org">
      <img src="https://img.shields.io/matrix/sonixd:matrix.org?color=black&label=matrix&logo=matrix&logoColor=white"
      alt="Matrix">
    </a>
  </p>

Rewrite of [feishin](https://github.com/jeffvli/feishin)

---

### What is the best way to stay updated on the project?

Please star the repo and follow the project for updates. You can also join the [Discord](https://discord.gg/FVKpcMDy5f) or [Matrix](https://matrix.to/#/#sonixd:matrix.org) servers where I post periodic updates and answer questions.

### How do I contribute to the project?

Pull requests are welcome!

To run the application in development, you to install the following dependencies:

- [Bun](https://bun.sh/)
- [Rust](https://www.rust-lang.org/)
- [Tauri CLI](https://v2.tauri.app/reference/cli/)

Once you have the dependencies installed, you can run the application in development mode with the following command:

```bash
# 1. In the root directory, run the following command
$ bun run init

# OR

# 1. Initialize the project manually
$ bun install
$ bun run build:packages
$ bun run build:server:desktop # And then copy the server binary to the /apps/web/src-tauri/target/external directory

# Open two terminals and navigate to the /apps/web and /apps/server directory respectively. The order you run the commands in matters, since running the web app will attempt to start the server separately.

# 2a. In terminal 1, run the following command in the /apps/server directory
$ bun run dev

# 2b. In terminal 2, run the following command in the /apps/web directory
$ bun run dev

```

### Building the application

To build the application locally, you will need to remove all references to the updater plugin from the tauri configuration files.

1. [tauri.conf.json](./apps/web/src-tauri/tauri.conf.json)
2. [desktop.json](./apps/web/src-tauri/capabilities/desktop.json)
3. [main.rs](./apps/web/src-tauri/src/main.rs)
4. [Cargo.toml](./apps/web/src-tauri/Cargo.toml)
5. [publish.yml](./apps/web/src-tauri/publish.yml)

After removing the updater plugin, you can build the application using the following command:

```bash
$ bun run deploy
```

The built application will be located in the [./apps/web/src-tauri/target/release](./apps/web/src-tauri/target/release) directory.
