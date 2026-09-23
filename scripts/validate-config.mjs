#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const KNOWN_KEYS = new Set(['version', 'default_locale', 'locales']);

function stripComment(line) {
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    if (line[index] === '"') quoted = !quoted;
    if (line[index] === '#' && !quoted) return line.slice(0, index);
  }
  return line;
}

export function parseConfig(source) {
  const result = {};
  const lines = source.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = stripComment(rawLine).trim();
    if (!line || line.startsWith('#')) continue;
    const match = /^(version|default_locale|locales)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match) {
      throw new Error(`Line ${index + 1}: unsupported TOML syntax or key: ${line}`);
    }
    const [, key, value] = match;
    if (Object.hasOwn(result, key)) throw new Error(`Line ${index + 1}: duplicate key "${key}".`);
    if (key === 'version') {
      if (!/^\d+$/.test(value)) throw new Error(`Line ${index + 1}: version must be an integer.`);
      result.version = Number(value);
    } else if (key === 'default_locale') {
      const parsed = /^"([^"\\]*)"$/.exec(value);
      if (!parsed) throw new Error(`Line ${index + 1}: default_locale must be a basic quoted string.`);
      result.default_locale = parsed[1];
    } else {
      if (!value.startsWith('[')) throw new Error(`Line ${index + 1}: locales must be an array of quoted strings.`);
      let arraySource = stripComment(value).trim();
      while (!arraySource.includes(']')) {
        const next = lines[++index];
        if (next === undefined) throw new Error(`Line ${index + 1}: unterminated locales array.`);
        arraySource += ` ${stripComment(next).trim()}`;
      }
      if (!/^\[\s*(?:"[^"\\]*"\s*(?:,\s*"[^"\\]*"\s*)*,?\s*)?\]$/.test(arraySource)) {
        throw new Error(`Line ${index + 1}: locales must contain only basic quoted strings.`);
      }
      result.locales = [...arraySource.matchAll(/"([^"\\]*)"/g)].map((entry) => entry[1]);
    }
  }

  for (const key of KNOWN_KEYS) {
    if (!Object.hasOwn(result, key)) throw new Error(`Missing required key "${key}".`);
  }
  if (result.version !== 1) throw new Error(`Unsupported configuration version ${result.version}; supported version is 1.`);
  if (!result.default_locale.trim()) throw new Error('default_locale must not be empty.');
  if (result.locales.length === 0) throw new Error('locales must contain at least one locale.');
  if (result.locales.some((locale) => !locale.trim())) throw new Error('locales must not contain an empty locale.');
  if (new Set(result.locales).size !== result.locales.length) throw new Error('locales must not contain duplicates.');
  if (!result.locales.includes(result.default_locale)) throw new Error('default_locale must be included in locales.');
  return result;
}

async function main() {
  const filePath = resolve(process.argv[2] ?? 'i18n-mason.toml');
  try {
    const config = await validateConfigFile(filePath);
    process.stdout.write(`Valid i18n-mason v${config.version} config: ${config.locales.length} locale(s), default ${config.default_locale}.\n`);
  } catch (error) {
    process.stderr.write(`Invalid i18n-mason config (${filePath}): ${error.message}\n`);
    process.exitCode = 1;
  }
}

export async function validateConfigFile(filePath) {
  return parseConfig(await readFile(filePath, 'utf8'));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
