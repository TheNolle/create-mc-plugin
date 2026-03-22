# 🚀 create-mc-plugin

A modern, interactive CLI to scaffold Minecraft plugin projects instantly.

---

# ⚠️ **Deprecated**

> This package is deprecated and no longer maintained. Please use [**create-nolly-template**](https://www.npmjs.com/package/create-nolly-template) instead, which supports Minecraft plugin templates and is actively maintained.

## 📦 Installation

```bash
pnpm add -g create-mc-plugin
```

Or use directly without installing:

```bash
pnpx create-mc-plugin
```

---

## 🛠 Usage

```bash
create-mc-plugin create
```

You'll be guided through an interactive prompt:

```
✔ Project name:          · MyPlugin
✔ Build tool:            · maven
✔ Language:              · kotlin
✔ Platform:              · purpurmc
✔ Minecraft version:     · 1.21.11
✔ IDE:                   · intellij
✔ Group ID:              · com.example
✔ Artifact ID:           · myplugin
✔ Description:           · A modern Minecraft plugin
✔ Authors:               · YourName
```

A preview is shown before anything is written to disk. You confirm, and the project is generated.

### Options

| Flag              | Description                        | Default |
|-------------------|------------------------------------|---------|
| `-n, --name`      | Pre-fill the project name          | —       |
| `-d, --dir`       | Output directory                   | `.`     |

---

## ✅ Supported Combinations

### 🔨 Build Tools

| Build Tool | Supported |
|------------|-----------|
| Maven      | ✅        |
| Gradle     | 🔜        |

### 💬 Languages

| Language | Supported |
|----------|-----------|
| Kotlin   | ✅        |
| Java     | 🔜        |

### 🖥 Platforms

| Platform  | Supported |
|-----------|-----------|
| PurpurMC  | ✅        |
| PaperMC   | 🔜        |
| Spigot    | 🔜        |
| Bukkit    | 🔜        |

### 🎮 Minecraft Versions

| Version  | Supported |
|----------|-----------|
| 1.21.11  | ✅        |
| 1.21.10  | 🔜        |

### 🧠 IDEs

| IDE         | Supported |
|-------------|-----------|
| IntelliJ    | ✅        |
| VS Code     | 🔜        |
| None        | ✅        |

---

## 📁 Generated Structure

Example for `maven / kotlin / purpurmc / 1.21.11 / intellij`:

```
MyPlugin/
├── .idea/
│   ├── .gitignore
│   └── runConfigurations/
│       └── Package.xml
├── src/
│   └── main/
│       ├── kotlin/
│       │   └── com/example/
│       │       └── MyPlugin.kt
│       └── resources/
│           └── plugin.yml
├── .gitignore
├── MyPlugin.iml
└── pom.xml
```

---

## 🧩 Template Placeholders

Templates use `{{PLACEHOLDER}}` syntax. Available placeholders:

| Placeholder      | Value                          |
|------------------|--------------------------------|
| `{{NAME}}`       | Project name (as-is)           |
| `{{name}}`       | Project name (lowercased)      |
| `{{GROUP ID}}`   | Maven group ID                 |
| `{{groupId}}`    | Maven group ID                 |
| `{{ARTIFACT ID}}`| Maven artifact ID              |
| `{{artifactId}}` | Maven artifact ID              |
| `{{DESCRIPTION}}`| Project description            |
| `{{AUTHORS}}`    | Authors (comma-separated)      |
| `{{VERSION}}`    | Minecraft version              |

---

## 📝 License

MIT