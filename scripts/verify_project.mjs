import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'README.md',
  'implementation_plan.md',
  'task.md',
  'ROADMAP.md',
  'TEST_MANUAL.md',
  'HARNESS.md',
  'package.json',
  'src/manifest.json',
  'src/background/background.js',
  'src/content/content.js',
  'src/content/content.css',
  'src/popup/popup.html',
  'src/popup/popup.js',
  'src/popup/popup.css',
  'src/manager/manager.html',
  'src/manager/manager.js',
  'src/manager/manager.css',
  'src/utils/storage.js',
  'src/utils/smart_tags.js',
  'src/_locales/ko/messages.json',
  'src/_locales/en/messages.json'
];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

for (const relativePath of requiredFiles) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    fail(`missing file ${relativePath}`);
  } else {
    pass(`found ${relativePath}`);
  }
}

const manifest = readJson('src/manifest.json');
if (manifest.manifest_version !== 3) {
  fail('manifest_version must be 3');
} else {
  pass('manifest_version is 3');
}

if (!Array.isArray(manifest.content_scripts) || !manifest.content_scripts.length) {
  fail('manifest missing content_scripts');
} else {
  pass('manifest includes content_scripts');
}

const requiredPermissions = ['storage', 'tabs', 'activeTab'];
for (const permission of requiredPermissions) {
  if (!manifest.permissions?.includes(permission)) {
    fail(`manifest missing permission ${permission}`);
  } else {
    pass(`manifest includes permission ${permission}`);
  }
}

const ko = readJson('src/_locales/ko/messages.json');
const en = readJson('src/_locales/en/messages.json');
const requiredMessages = [
  'appName',
  'appDesc',
  'saveCurrentTab',
  'recentItems',
  'openManager',
  'addItem',
  'exportJson',
  'importJson'
];

for (const key of requiredMessages) {
  if (!ko[key]) {
    fail(`ko locale missing ${key}`);
  } else {
    pass(`ko locale includes ${key}`);
  }

  if (!en[key]) {
    fail(`en locale missing ${key}`);
  } else {
    pass(`en locale includes ${key}`);
  }
}

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const task = fs.readFileSync(path.join(root, 'task.md'), 'utf8');

if (!readme.includes('## 문서 맵')) {
  fail('README.md missing document map section');
} else {
  pass('README.md includes document map section');
}

if (!task.includes('## 5. Next Work')) {
  fail('task.md missing next work section');
} else {
  pass('task.md includes next work section');
}

if (process.exitCode) {
  console.error('Verification failed');
} else {
  console.log('Verification passed');
}
