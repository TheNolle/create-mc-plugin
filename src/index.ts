#!/usr/bin/env node

import { program } from 'commander'
import chalk from 'chalk'
import enquirer from 'enquirer'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import packageJson from '../package.json' with { type: 'json' }

const { prompt } = enquirer

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface Answers {
  name: string
  language: string
  version: string
  platform: string
  ide: string
  buildTool: string
  groupId: string
  artifactId: string
  description: string
  authors: string
}

interface TemplateMeta {
  description: string
  files: string[]
  notes?: string[]
}

async function getDynamicChoices(basePath: string, subpath: string): Promise<string[]> {
  const fullPath = subpath ? path.join(basePath, subpath) : basePath
  if (!await fs.pathExists(fullPath)) return []

  try {
    const items = await fs.readdir(fullPath)
    const dirs: string[] = []
    for (const item of items) {
      if (item.startsWith('.') || item === 'meta.json') continue
      const stat = await fs.stat(path.join(fullPath, item))
      if (stat.isDirectory()) dirs.push(item)
    }
    return dirs
  } catch {
    return []
  }
}

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)

program
  .command('list')
  .description('List available templates')
  .action(async () => {
    console.clear()
    console.log(chalk.cyanBright(`
${'='.repeat(50)}
  📂 Available Minecraft Plugin Templates
${'='.repeat(50)}
    `))
    const templatesBase = path.join(__dirname, '..', 'templates')
    const buildTools = await getDynamicChoices(templatesBase, '')
    if (buildTools.length === 0) {
      console.log(chalk.yellow('No templates found!'))
      return
    }
    for (const buildTool of buildTools) {
      const languages = await getDynamicChoices(templatesBase, buildTool)
      for (const language of languages) {
        const platforms = await getDynamicChoices(templatesBase, `${buildTool}/${language}`)
        for (const platform of platforms) {
          const versions = await getDynamicChoices(templatesBase, `${buildTool}/${language}/${platform}`)
          for (const version of versions) {
            console.log(chalk.greenBright(`- ${buildTool} / ${language} / ${platform} / ${version}`))
          }
        }
      }
    }
  })

program
  .command('create')
  .description('Create new Minecraft plugin template')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --dir <dir>', 'Output directory', '.')
  .action(async (cmd) => {
    console.clear()

    console.log(chalk.cyanBright(`
${'='.repeat(50)}
  🚀 Minecraft Plugin Template Generator
${'='.repeat(50)}
    `))

    const templatesBase = path.join(__dirname, '..', 'templates')

    const { name } = await prompt<{ name: string }>({
      type: 'input',
      name: 'name',
      message: 'Project name:',
      initial: cmd.name || 'MyPlugin',
      validate: (v: string) => v.trim().length > 0 || 'Name is required'
    })

    const buildTools = await getDynamicChoices(templatesBase, '')
    const { buildTool } = await prompt<{ buildTool: string }>({
      type: 'select',
      name: 'buildTool',
      message: 'Build tool:',
      choices: buildTools.length ? buildTools : ['maven']
    })

    const languages = await getDynamicChoices(templatesBase, buildTool)
    const { language } = await prompt<{ language: string }>({
      type: 'select',
      name: 'language',
      message: 'Language:',
      choices: languages.length ? languages : ['kotlin']
    })

    const platforms = await getDynamicChoices(templatesBase, `${buildTool}/${language}`)
    const { platform } = await prompt<{ platform: string }>({
      type: 'select',
      name: 'platform',
      message: 'Platform:',
      choices: platforms.length ? platforms : ['purpurmc']
    })

    const versions = await getDynamicChoices(templatesBase, `${buildTool}/${language}/${platform}`)
    const { version } = await prompt<{ version: string }>({
      type: 'select',
      name: 'version',
      message: 'Minecraft version:',
      choices: versions.length ? versions : ['1.21.11']
    })

    const { ide } = await prompt<{ ide: string }>({
      type: 'select',
      name: 'ide',
      message: 'IDE:',
      choices: ['intellij', 'none']
    })

    const templatePath = path.join(templatesBase, buildTool, language, platform, version)
    if (!await fs.pathExists(templatePath)) {
      console.log(chalk.redBright('\n❌ No built-in template found!'))
      console.log(chalk.red(`   Missing: templates/${buildTool}/${language}/${platform}/${version}`))
      console.log(chalk.yellow('   Available combinations depend on built-in templates packaged with this CLI.'))
      process.exit(1)
    }

    const { groupId } = await prompt<{ groupId: string }>({
      type: 'input',
      name: 'groupId',
      message: 'Group ID:',
      initial: 'com.example',
      validate: (v: string) => /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(v) || 'Invalid Maven group ID'
    })

    const { artifactId } = await prompt<{ artifactId: string }>({
      type: 'input',
      name: 'artifactId',
      message: 'Artifact ID:',
      initial: name.toLowerCase().replace(/\s+/g, '-'),
      validate: (v: string) => /^[a-z][a-z0-9_-]*$/.test(v) || 'Invalid Maven artifact ID'
    })

    const { description } = await prompt<{ description: string }>({
      type: 'input',
      name: 'description',
      message: 'Description:',
      initial: 'A modern Minecraft plugin'
    })

    const { authors } = await prompt<{ authors: string }>({
      type: 'input',
      name: 'authors',
      message: 'Authors (comma-separated):',
      initial: 'YourName'
    })

    const answers: Answers = { name, buildTool, language, platform, version, ide, groupId, artifactId, description, authors }

    const projectDir = path.resolve(cmd.dir, answers.name)

    const { confirm } = await prompt<{ confirm: boolean }>({
      type: 'confirm',
      name: 'confirm',
      message: 'Create project?'
    })

    if (!confirm) {
      console.log(chalk.yellow('Cancelled.'))
      process.exit(0)
    }

    if (await fs.pathExists(projectDir)) {
      const { overwrite } = await prompt<{ overwrite: boolean }>({
        type: 'confirm',
        name: 'overwrite',
        message: `Directory ${projectDir} exists. Overwrite?`
      })
      if (!overwrite) process.exit(0)
      await fs.emptyDir(projectDir)
    } else {
      await fs.ensureDir(projectDir)
    }

    const metaPath = path.join(templatePath, 'meta.json')
    if (await fs.pathExists(metaPath)) {
      try {
        const meta: TemplateMeta = await fs.readJson(metaPath)
        console.log(chalk.blueBright(`\n📋 ${meta.description}`))
        if (meta.notes?.length) meta.notes.forEach(n => console.log(chalk.gray(`   • ${n}`)))
        console.log('')
      } catch { }
    }

    await copyAndReplace(templatePath, projectDir, answers, answers.ide)

    console.log(chalk.greenBright(`\n🎉 ${name} created! → cd ${name}`))
  })

async function copyAndReplace(src: string, dest: string, data: Answers, ide: string): Promise<void> {
  const files = await fs.readdir(src)
  for (const file of files) {
    if (file === 'meta.json') continue

    if (file === '.idea' && ide !== 'intellij') continue
    if (file === '.vscode' && ide !== 'vscode') continue

    const srcPath = path.join(src, file)

    const resolvedFile = file
      .replace(/\{\{NAME\}\}/g, data.name)
      .replace(/\{\{name\}\}/g, data.name.toLowerCase())
      .replace(/\{\{groupId\}\}/g, data.groupId)
      .replace(/\{\{artifactId\}\}/g, data.artifactId)

    const stat = await fs.stat(srcPath)

    if (stat.isDirectory()) {
      const destPath = path.join(dest, resolvedFile)
      await fs.ensureDir(destPath)
      await copyAndReplace(srcPath, destPath, data, ide)
    } else {
      const isKotlinSource = dest.includes(path.join('src', 'main', 'kotlin'))
      const destPath = isKotlinSource
        ? path.join(dest, ...data.groupId.split('.'), resolvedFile)
        : path.join(dest, resolvedFile)

      await fs.ensureDir(path.dirname(destPath))

      let content = await fs.readFile(srcPath, 'utf8')
      content = content
        .replace(/\{\{NAME\}\}/g, data.name)
        .replace(/\{\{name\}\}/g, data.name.toLowerCase())
        .replace(/\{\{GROUP ID\}\}/g, data.groupId)
        .replace(/\{\{groupId\}\}/g, data.groupId)
        .replace(/\{\{ARTIFACT ID\}\}/g, data.artifactId)
        .replace(/\{\{artifactId\}\}/g, data.artifactId)
        .replace(/\{\{DESCRIPTION\}\}/g, data.description)
        .replace(/\{\{AUTHORS\}\}/g, data.authors)
        .replace(/\{\{VERSION\}\}/g, data.version)
      await fs.writeFile(destPath, content)
    }
  }
}

program.parse()