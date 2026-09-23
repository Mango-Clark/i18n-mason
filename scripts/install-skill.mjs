#!/usr/bin/env node
import { copyFile, lstat, mkdir, readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = join(packageRoot, 'skills', 'i18n-mason');

export function getInstallDestination(project = homedir()) {
  return join(resolve(project), '.agents', 'skills', 'i18n-mason');
}

async function listFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relativePath = prefix ? join(prefix, entry.name) : entry.name;
    const absolutePath = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symbolic links are not supported in skill packages: ${relativePath}`);
    if (entry.isDirectory()) files.push(...await listFiles(absolutePath, relativePath));
    else if (entry.isFile()) files.push(relativePath);
    else throw new Error(`Unsupported skill package entry: ${relativePath}`);
  }
  return files;
}

async function inspectInstallation(source, destination, sourceFiles) {
  const conflicts = [];
  let installedFileCount = 0;
  for (const file of sourceFiles) {
    const installedPath = join(destination, file);
    let installedInfo;
    try {
      installedInfo = await lstat(installedPath);
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    if (installedInfo.isSymbolicLink()) {
      throw new Error(`Refusing to overwrite a symbolic link: ${installedPath}`);
    }
    if (!installedInfo.isFile()) {
      conflicts.push(file);
      continue;
    }
    installedFileCount += 1;
    const [sourceContents, installedContents] = await Promise.all([
      readFile(join(source, file)),
      readFile(installedPath),
    ]);
    if (!sourceContents.equals(installedContents)) conflicts.push(file);
  }
  return { conflicts, installedFileCount };
}

async function assertNoSymlinkComponents(project, destination) {
  const components = [project, join(project, '.agents'), join(project, '.agents', 'skills'), destination];
  for (const component of components) {
    try {
      if ((await lstat(component)).isSymbolicLink()) {
        throw new Error(`Refusing to install through a symbolic link: ${component}`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

export async function installSkill({
  source = sourceRoot,
  project = homedir(),
  force = false,
} = {}) {
  const resolvedSource = resolve(source);
  const resolvedProject = resolve(project);
  const destination = getInstallDestination(resolvedProject);
  const sourceInfo = await lstat(resolvedSource);
  if (!sourceInfo.isDirectory()) throw new Error(`Skill source is not a directory: ${resolvedSource}`);
  try {
    await lstat(join(resolvedSource, 'SKILL.md'));
  } catch {
    throw new Error(`Skill source is missing SKILL.md: ${resolvedSource}`);
  }

  const sourceFiles = await listFiles(resolvedSource);
  if (!sourceFiles.includes('SKILL.md')) throw new Error(`Skill source is missing SKILL.md: ${resolvedSource}`);
  await assertNoSymlinkComponents(resolvedProject, destination);

  let destinationExists = false;
  try {
    const destinationInfo = await lstat(destination);
    if (!destinationInfo.isDirectory()) throw new Error(`Install destination is not a directory: ${destination}`);
    destinationExists = true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  if (destinationExists) {
    const { conflicts, installedFileCount } = await inspectInstallation(resolvedSource, destination, sourceFiles);
    if (conflicts.length > 0 && !force) {
      throw new Error(`Install destination contains modified or conflicting files: ${conflicts.join(', ')}. Review it or rerun with --force.`);
    }
    if (conflicts.length === 0 && installedFileCount === sourceFiles.length) return { destination, changed: false };
  }

  for (const relativePath of sourceFiles) {
    const outputPath = join(destination, relativePath);
    await mkdir(dirname(outputPath), { recursive: true });
    await copyFile(join(resolvedSource, relativePath), outputPath);
  }

  return { destination, changed: true };
}

function parseArgs(args) {
  let project = homedir();
  let force = false;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--force') {
      force = true;
    } else if (args[index] === '--project') {
      if (!args[index + 1]) throw new Error('--project requires a directory path.');
      project = resolve(args[++index]);
    } else {
      throw new Error(`Unknown option: ${args[index]}`);
    }
  }
  return { project, force };
}

async function main() {
  try {
    const { project, force } = parseArgs(process.argv.slice(2));
    const result = await installSkill({ project, force });
    const relativeDestination = result.destination;
    process.stdout.write(`${result.changed ? 'Installed' : 'Already up to date'} i18n-mason at ${relativeDestination}\n`);
  } catch (error) {
    process.stderr.write(`i18n-mason install failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
