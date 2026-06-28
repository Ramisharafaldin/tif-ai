import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const srcPath = resolve(projectRoot, 'src', 'tif-ai.js');
const distDir = resolve(projectRoot, 'dist');
const distPath = resolve(distDir, 'tif-ai.js');

console.log('🔨 Building TIF-AI CLI...');

try {
  // Ensure dist directory exists
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }

  // Read src/tif-ai.js
  let content = readFileSync(srcPath, 'utf-8');

  // Ensure it starts with the shebang
  if (!content.startsWith('#!/usr/bin/env node')) {
    content = '#!/usr/bin/env node\n\n' + content;
  }

  // Write to dist/tif-ai.js
  writeFileSync(distPath, content, 'utf-8');
  console.log(`✓ Written executable to ${distPath}`);

  // Make it executable on Unix/macOS
  try {
    chmodSync(distPath, '755');
    console.log('✓ Set executable permissions (chmod 755)');
  } catch (chmodErr) {
    // Chmod might fail on Windows, which is normal and safe to ignore
    console.log('ℹ Skipping chmod on Windows (handled by npm wrapper)');
  }

  console.log('🎉 CLI build successful!');
} catch (err) {
  console.error('✗ CLI build failed:', err.message);
  process.exit(1);
}
