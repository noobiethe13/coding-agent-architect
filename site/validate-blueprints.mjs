import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../blueprints');

const TYPE_FOLDERS = new Set(['agents', 'skills', 'rules']);
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PHASE_FILE = /^phase-(\d+)\.md$/;
const FLAT_FILE = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;

const errors = [];

function listDir(p) {
  return fs.readdirSync(p, { withFileTypes: true });
}

if (!fs.existsSync(root)) {
  console.error(`Blueprint validation failed: ${root} does not exist`);
  process.exit(1);
}

for (const tool of listDir(root)) {
  if (tool.name.startsWith('.')) continue;
  if (!tool.isDirectory()) {
    errors.push(`Loose file at blueprints/${tool.name} — top level must contain only tool folders`);
    continue;
  }
  if (!KEBAB.test(tool.name)) {
    errors.push(`Tool folder "${tool.name}" must be kebab-case`);
    continue;
  }

  const toolPath = path.join(root, tool.name);
  for (const folder of listDir(toolPath)) {
    if (folder.name.startsWith('.')) continue;
    if (!folder.isDirectory()) {
      errors.push(`Loose file in ${tool.name}/: ${folder.name} — every blueprint must live inside a goal or type folder`);
      continue;
    }
    if (!KEBAB.test(folder.name)) {
      errors.push(`Folder "${tool.name}/${folder.name}" must be kebab-case`);
      continue;
    }

    const folderPath = path.join(toolPath, folder.name);
    const entries = listDir(folderPath);

    for (const e of entries) {
      if (e.isDirectory()) {
        errors.push(`Unexpected subdirectory ${tool.name}/${folder.name}/${e.name}/ — folders must be flat`);
      }
    }

    const files = entries
      .filter((e) => e.isFile() && !e.name.startsWith('.'))
      .map((e) => e.name);

    if (TYPE_FOLDERS.has(folder.name)) {
      for (const f of files) {
        if (!FLAT_FILE.test(f)) {
          errors.push(
            `${tool.name}/${folder.name}/${f} must be a kebab-case .md file`
          );
        }
      }
    } else {
      const phaseNums = [];
      for (const f of files) {
        const m = PHASE_FILE.exec(f);
        if (!m) {
          errors.push(
            `Goal folder ${tool.name}/${folder.name}/ contains a non-phase file: ${f} (expected phase-N.md)`
          );
        } else {
          phaseNums.push(Number(m[1]));
        }
      }

      if (phaseNums.length === 0) {
        errors.push(
          `Goal folder ${tool.name}/${folder.name}/ is empty — must contain at least phase-0.md`
        );
      } else {
        phaseNums.sort((a, b) => a - b);
        const expected = phaseNums.map((_, i) => i);
        const mismatch = phaseNums.some((n, i) => n !== expected[i]);
        if (mismatch) {
          errors.push(
            `Goal folder ${tool.name}/${folder.name}/ phases must be sequential starting at phase-0 with no gaps. Found: ${phaseNums.map((n) => `phase-${n}`).join(', ')}`
          );
        }
      }
    }
  }
}

if (errors.length) {
  console.error('Blueprint structure validation failed:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('Blueprint structure validation passed.');
