import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const target = path.resolve(__dirname, '../blueprints');
const dest = path.resolve(__dirname, 'src/content/docs/blueprints');

// Ensure parent directory exists
const destDir = path.dirname(dest);
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  let shouldCreate = true;
  
  if (fs.existsSync(dest)) {
    const stat = fs.lstatSync(dest);
    if (stat.isSymbolicLink()) {
      shouldCreate = false;
      console.log('✅ Symlink already exists.');
    } else {
      console.log('⚠️ Destination exists but is not a symlink. Removing...');
      fs.rmSync(dest, { recursive: true, force: true });
    }
  }

  if (shouldCreate) {
    // 'junction' allows symlinking directories on Windows without Administrator privileges
    const symlinkType = process.platform === 'win32' ? 'junction' : 'dir';
    fs.symlinkSync(target, dest, symlinkType);
    console.log(`✅ Successfully symlinked:\n   ${target}\n   -> ${dest}`);
  }
} catch (err) {
  console.error('❌ Failed to create symlink:', err.message);
  process.exit(1);
}
