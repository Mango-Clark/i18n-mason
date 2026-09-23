import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseConfig, validateConfigFile } from '../scripts/validate-config.mjs';
import { installSkill } from '../scripts/install-skill.mjs';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const valid = 'version = 1\ndefault_locale = "en-US"\nlocales = ["en-US", "ko-KR"]\n';

test('accepts minimal v1 intent without imposing locale syntax or implementation fields', () => {
  assert.deepEqual(parseConfig(valid), { version: 1, default_locale: 'en-US', locales: ['en-US', 'ko-KR'] });
  assert.deepEqual(parseConfig('version=1\ndefault_locale="zh-Hant"\nlocales=["zh-Hant","en"]'), {
    version: 1, default_locale: 'zh-Hant', locales: ['zh-Hant', 'en'],
  });
});

test('accepts multiline locale arrays and comments', () => {
  assert.deepEqual(parseConfig('# locale intent\nversion = 1 # schema\ndefault_locale = "pt-BR"\nlocales = [\n  "pt-BR",\n  "pt-PT", # regional variant\n]\n'), {
    version: 1, default_locale: 'pt-BR', locales: ['pt-BR', 'pt-PT'],
  });
  assert.deepEqual(parseConfig('version=1\ndefault_locale="x#test"\nlocales=["x#test", "en"] # keep values\n').locales, ['x#test', 'en']);
});

test('rejects malformed, ambiguous, or invalid config with actionable errors', () => {
  for (const [source, fragment] of [
    ['version=1\ndefault_locale="en"\nlocales=["en"]\nframework="next-intl"', 'unsupported TOML syntax or key'],
    ['version=2\ndefault_locale="en"\nlocales=["en"]', 'Unsupported configuration version'],
    ['version=1\ndefault_locale="en"\nlocales=["fr"]', 'must be included'],
    ['version=1\ndefault_locale="en"\nlocales=["en","en"]', 'duplicates'],
    ['version=1\ndefault_locale="en"\nlocales=["en" "fr"]', 'locales must contain only'],
    ['version=1\ndefault_locale="en"\nlocales=[]', 'at least one locale'],
    ['version=1\nversion=1\ndefault_locale="en"\nlocales=["en"]', 'duplicate key'],
    ['version="1"\ndefault_locale="en"\nlocales=["en"]', 'version must be an integer'],
    ['version=1\ndefault_locale="en"\nlocales=["en"', 'unterminated'],
  ]) {
    assert.throws(() => parseConfig(source), new RegExp(fragment));
  }
});

test('config file validator accepts root config and rejects invalid files with actionable errors', async (t) => {
  const content = await readFile(new URL('../i18n-mason.toml', import.meta.url), 'utf8');
  assert.deepEqual(parseConfig(content).locales, ['en-US', 'ko-KR']);
  const directory = await mkdtemp(join(tmpdir(), 'i18n-mason-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const configPath = join(directory, 'i18n-mason.toml');
  await writeFile(configPath, 'version=1\ndefault_locale="ja"\nlocales=["en"]');
  await assert.rejects(validateConfigFile(configPath), /must be included/);
});

test('heterogeneous fixtures retain distinct systems, source boundaries, and user-facing scopes', async () => {
  const fixtureRoot = fileURLToPath(new URL('./fixtures/', import.meta.url));
  const read = async (path) => readFile(join(fixtureRoot, path), 'utf8');
  const nextRouting = await read('next-intl-app/src/i18n/routing.ts');
  const nextRequest = await read('next-intl-app/src/i18n/request.ts');
  const nextEn = JSON.parse(await read('next-intl-app/messages/en.json'));
  const nextKo = JSON.parse(await read('next-intl-app/messages/ko.json'));
  assert.match(nextRouting, /locales: \['en', 'ko'\]/);
  assert.match(nextRouting, /localePrefix: 'as-needed'/);
  assert.match(nextRequest, /locale \?\? routing\.defaultLocale/);
  assert.match(nextRequest, /import\(`\.\.\/\.\.\/messages\/\$\{resolvedLocale\}\.json`\)/);
  assert.deepEqual(Object.keys(nextEn), Object.keys(nextKo));
  assert.match(nextEn.Cart.items, /plural/);
  assert.match(nextKo.Cart.items, /plural/);

  const vueInit = await read('i18next-app/src/i18n.ts');
  const vueSource = JSON.parse(await read('i18next-app/src/features/billing/locales/en/common.json'));
  const vueTarget = JSON.parse(await read('i18next-app/src/features/billing/locales/ko/common.json'));
  const vueGenerated = JSON.parse(await read('i18next-app/dist/locales/en/common.json'));
  assert.match(vueInit, /fallbackLng: 'en'/);
  assert.match(vueInit, /features\/billing\/locales/);
  assert.match(vueGenerated._generated, /build output/);
  assert.deepEqual(Object.keys(vueSource), Object.keys(vueTarget));
  assert.match(vueSource.invoice, /\{number\}/);
  assert.match(vueTarget.invoice, /\{number\}/);
  assert.notDeepEqual(vueGenerated, vueSource);

  const gettextApp = await read('gettext-python/app.py');
  const poEn = await read('gettext-python/locale/en/LC_MESSAGES/service.po');
  const poKo = await read('gettext-python/locale/ko/LC_MESSAGES/service.po');
  const mail = await read('gettext-python/email.py');
  assert.match(gettextApp, /gettext\.translation/);
  assert.match(poEn, /Plural-Forms: nplurals=2/);
  assert.match(poKo, /Plural-Forms: nplurals=1/);
  assert.match(mail, /invoice_email/);

  const cliSource = await read('native-cli/src.rs');
  const ftlEn = await read('native-cli/locales/en/main.ftl');
  const ftlAr = await read('native-cli/locales/ar/main.ftl');
  assert.match(cliSource, /get_message\("help-title"\)/);
  assert.match(cliSource, /"--output-format"/);
  assert.match(cliSource, /EXIT_USAGE_ERROR/);
  assert.match(ftlEn, /\$count/);
  assert.match(ftlAr, /\$count/);
  assert.match(ftlAr, /\[one\]/);
  assert.match(ftlAr, /\*\[other\]/);

  const webRouting = await read('monorepo/apps/web/i18n.ts');
  const mobileStrings = await read('monorepo/apps/mobile/src/main/res/values/strings.xml');
  const apiErrors = await read('monorepo/services/api/errors.go');
  assert.match(webRouting, /locales: \['en', 'fr'\]/);
  assert.match(mobileStrings, /<string name="settings_title">/);
  assert.match(apiErrors, /ACCOUNT_LOCKED/);
  assert.doesNotMatch(apiErrors, /localized|gettext|i18next/i);

  const staticHtml = await read('empty-static/index.html');
  assert.match(staticHtml, /<html lang="en">/);
  assert.match(staticHtml, /망고의 홈페이지입니다/);
  assert.doesNotMatch(staticHtml, /locale|i18n|translation/i);
});

test('configured identifiers can conflict with observed public locale identifiers without normalization', async () => {
  const fixtureRoot = fileURLToPath(new URL('./fixtures/', import.meta.url));
  const configured = parseConfig('version=1\ndefault_locale="en-US"\nlocales=["en-US", "fr-FR"]');
  const observed = await readFile(join(fixtureRoot, 'monorepo/apps/web/i18n.ts'), 'utf8');
  const observedIds = [...new Set([...observed.matchAll(/'([a-z]{2})'/g)].map((match) => match[1]))];
  assert.deepEqual(configured.locales, ['en-US', 'fr-FR']);
  assert.deepEqual(observedIds, ['en', 'fr']);
  assert.ok(configured.locales.some((locale) => !observedIds.includes(locale)));
  assert.ok(observedIds.some((locale) => !configured.locales.includes(locale)));
});

test('custom JSON localization preserves its explicit fallback chain and missing-key behavior', async () => {
  const fixtureRoot = fileURLToPath(new URL('./fixtures/custom-json/', import.meta.url));
  const { translate } = await import(pathToFileURL(join(fixtureRoot, 'src.mjs')));
  assert.equal(translate('fr', 'save'), 'Enregistrer');
  assert.equal(translate('fr-CA', 'cancel'), 'Cancel');
  assert.equal(translate('ja', 'cancel'), 'Cancel');
  assert.equal(translate('fr', 'missing'), undefined);
});

test('homegrown locale selection follows user override, browser locale, and documented failure fallback', async () => {
  const fixtureRoot = fileURLToPath(new URL('./fixtures/typescript-dictionary/src/i18n/', import.meta.url));
  const { getLocale, translate } = await import(pathToFileURL(join(fixtureRoot, 'runtime.mjs')));
  const { messages: en } = await import(pathToFileURL(join(fixtureRoot, 'en.mjs')));
  const { messages: ko } = await import(pathToFileURL(join(fixtureRoot, 'ko.mjs')));
  assert.equal(getLocale('en', 'ko-KR'), 'en');
  assert.equal(getLocale(undefined, 'ko-KR'), 'ko');
  assert.equal(getLocale(undefined, 'fr-CA'), 'en');
  assert.equal(getLocale(undefined, null), 'ko');
  assert.equal(getLocale(null, null), 'ko');
  assert.deepEqual(Object.keys(en).sort(), Object.keys(ko).sort());
  assert.equal(translate('ko', 'pageStatus', 2, 5), '2 / 5 페이지');
  const bundle = await readFile(join(fixtureRoot, '../../dist/userscript.js'), 'utf8');
  assert.match(bundle, /generated by scripts\/build-userscript/);
  assert.match(bundle, /I18N_EN/);
  assert.match(bundle, /I18N_KO/);
});

test('translation pairs expose placeholder and ICU plural mismatches as separate contract failures', async () => {
  const fixtureRoot = fileURLToPath(new URL('./fixtures/placeholder-mismatch/', import.meta.url));
  const en = JSON.parse(await readFile(join(fixtureRoot, 'en.json')));
  const fr = JSON.parse(await readFile(join(fixtureRoot, 'fr.json')));
  const tokens = (message) => [...message.matchAll(/\{([A-Za-z_][\w.-]*)\s*(?:,|\})/g)].map((match) => match[1]);
  assert.deepEqual(tokens(en.welcome), ['userName']);
  assert.deepEqual(tokens(fr.welcome), ['username']);
  assert.notDeepEqual(tokens(en.welcome), tokens(fr.welcome));
  assert.deepEqual(tokens(en.items), ['count']);
  assert.deepEqual(tokens(fr.items), ['count']);

  const invalidRoot = fileURLToPath(new URL('./fixtures/invalid-icu/', import.meta.url));
  const source = JSON.parse(await readFile(join(invalidRoot, 'en.json')));
  const target = JSON.parse(await readFile(join(invalidRoot, 'ja.json')));
  const pluralCategories = (message) => [...message.matchAll(/(?:^|\s)(zero|one|two|few|many|other)\s*\{/g)].map((match) => match[1]).sort();
  assert.deepEqual(pluralCategories(source.items), ['one', 'other']);
  assert.deepEqual(pluralCategories(target.items), ['many']);
  assert.ok(!pluralCategories(target.items).includes('other'));
});

test('backend-localized messages and client-localized stable error codes remain distinct patterns', async () => {
  const fixtureRoot = fileURLToPath(new URL('./fixtures/', import.meta.url));
  const localizedService = await readFile(join(fixtureRoot, 'backend-localized-errors/service.py'), 'utf8');
  const api = await readFile(join(fixtureRoot, 'monorepo/services/api/errors.go'), 'utf8');
  const frontendConsumer = await readFile(join(fixtureRoot, 'monorepo/apps/web/error-message.ts'), 'utf8');
  const frontendCatalog = JSON.parse(await readFile(join(fixtureRoot, 'monorepo/apps/web/messages/en.json')));
  assert.match(localizedService, /catalog\.gettext\(/);
  assert.match(localizedService, /"code": error_code/);
  assert.match(api, /ACCOUNT_LOCKED/);
  assert.match(frontendConsumer, /errorMessages\[code\]/);
  assert.match(frontendConsumer, /accountLocked/);
  assert.deepEqual(Object.keys(frontendCatalog.errors), ['accountLocked']);
});

test('RTL locale support is checked through application direction and logical layout evidence', async () => {
  const fixtureRoot = fileURLToPath(new URL('./fixtures/rtl-web/src/', import.meta.url));
  const localeSource = await readFile(join(fixtureRoot, 'locale.ts'), 'utf8');
  const markup = await readFile(join(fixtureRoot, 'layout.html'), 'utf8');
  const styles = await readFile(join(fixtureRoot, 'styles.css'), 'utf8');
  assert.match(localeSource, /'en', 'ar'/);
  assert.match(localeSource, /locale === 'ar' \? 'rtl'/);
  assert.match(markup, /lang="ar" dir="rtl"/);
  assert.match(styles, /margin-inline-start/);
  assert.match(styles, /text-align: start/);
});

test('build installer copies the complete skill, is repeatable, and preserves local files', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'i18n-mason-install-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = join(root, 'source');
  const project = join(root, 'project');
  await mkdir(join(source, 'references'), { recursive: true });
  await writeFile(join(source, 'SKILL.md'), '# fixture skill\n');
  await writeFile(join(source, 'references', 'guide.md'), '# guide\n');

  const first = await installSkill({ source, project });
  assert.equal(first.changed, true);
  assert.equal(first.destination, join(project, '.agent', 'skills', 'i18n-mason'));
  assert.equal(await readFile(join(first.destination, 'references', 'guide.md'), 'utf8'), '# guide\n');
  assert.equal((await installSkill({ source, project })).changed, false);

  await writeFile(join(first.destination, 'local-notes.md'), 'keep this file\n');
  await writeFile(join(first.destination, 'SKILL.md'), '# local edit\n');
  await assert.rejects(installSkill({ source, project }), /modified or conflicting files.*--force/);
  assert.equal(await readFile(join(first.destination, 'SKILL.md'), 'utf8'), '# local edit\n');

  const forced = await installSkill({ source, project, force: true });
  assert.equal(forced.changed, true);
  assert.equal(await readFile(join(first.destination, 'SKILL.md'), 'utf8'), '# fixture skill\n');
  assert.equal(await readFile(join(first.destination, 'local-notes.md'), 'utf8'), 'keep this file\n');
});

test('build installer rejects a source without SKILL.md', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'i18n-mason-invalid-source-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = join(root, 'source');
  await mkdir(source);
  await assert.rejects(installSkill({ source, project: join(root, 'project') }), /missing SKILL.md/);
});
