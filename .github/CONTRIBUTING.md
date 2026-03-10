# Contributing to create-mc-plugin

Thanks for your interest! Here's how to contribute.

## Setup

```bash
git clone https://github.com/thenolle/create-mc-plugin
cd create-mc-plugin
pnpm install
pnpm run build
```

## Running Locally

```bash
node dist/index.js create
```

## Adding a Template

1. Create the folder: `templates/{buildTool}/{language}/{platform}/{version}/`
2. Add your files with `{{PLACEHOLDER}}` syntax (see README)
3. Add a `meta.json` with `description`, `files`, and optional `notes`
4. Test it end-to-end
5. Update the supported combinations table in `README.md`
6. Open a PR

## Available Placeholders

| Placeholder       | Value                     |
|-------------------|---------------------------|
| `{{NAME}}`        | Project name (as-is)      |
| `{{name}}`        | Project name (lowercased) |
| `{{GROUP ID}}`    | Maven group ID            |
| `{{groupId}}`     | Maven group ID            |
| `{{ARTIFACT ID}}` | Maven artifact ID         |
| `{{artifactId}}`  | Maven artifact ID         |
| `{{DESCRIPTION}}` | Project description       |
| `{{AUTHORS}}`     | Authors (comma-separated) |
| `{{VERSION}}`     | Minecraft version         |

## Commit Style

```
feat: add papermc 1.21.11 kotlin template
fix: resolve groupId folder expansion on Windows
docs: update supported versions table
```

## Code Style
- No semicolons
- Single quotes
- Modular, DRY, OOP where relevant
- Document everything non-obvious