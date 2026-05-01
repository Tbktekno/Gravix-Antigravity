#!/usr/bin/env node

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Constants ────────────────────────────────────────────────────────────────

const PACKAGE_NAME    = 'gravix-skill';
const AGENTS_DIR_NAME = '.agents';
const SOURCE_DIR      = path.join(__dirname, '..', AGENTS_DIR_NAME);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(message) {
  process.stdout.write(message + '\n');
}

function logError(message) {
  process.stderr.write('[ERROR] ' + message + '\n');
}

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath  = path.join(src,  entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function countFiles(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

function listInstalled(dir, baseDir, lines) {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    const relative = path.join(dir, entry.name).replace(baseDir, '').replace(/\\/g, '/');
    if (entry.isDirectory()) {
      lines.push('    ' + relative + '/');
      listInstalled(path.join(dir, entry.name), baseDir, lines);
    } else {
      lines.push('    ' + relative);
    }
  }
}

// ─── Commands ─────────────────────────────────────────────────────────────────

function cmdInstall(args) {
  const force      = args.includes('--force');
  const targetCwd  = process.cwd();
  const targetDir  = path.join(targetCwd, AGENTS_DIR_NAME);

  log('');
  log('Gravix — Global Software Intelligence System');
  log('--------------------------------------------');
  log('');

  // Verify source exists (sanity check for the package itself)
  if (!fs.existsSync(SOURCE_DIR)) {
    logError('Package source directory not found: ' + SOURCE_DIR);
    logError('The gravix package may be corrupted. Try reinstalling.');
    process.exit(1);
  }

  // Check if .agents/ already exists at destination
  if (fs.existsSync(targetDir)) {
    if (!force) {
      log('An .agents/ directory already exists in this project.');
      log('');
      log('To overwrite the existing installation, run:');
      log('');
      log('    npx gravix install --force');
      log('');
      process.exit(1);
    } else {
      log('Force flag detected. Overwriting existing .agents/ directory...');
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
  }

  log('Installing .agents/ into: ' + targetCwd);
  log('');

  try {
    copyDirectory(SOURCE_DIR, targetDir);
  } catch (err) {
    logError('Failed to copy files: ' + err.message);
    process.exit(1);
  }

  const fileCount = countFiles(targetDir);
  const lines     = [];
  listInstalled(targetDir, targetCwd, lines);

  log('Installed files:');
  log('');
  lines.forEach(function(line) { log(line); });
  log('');
  log('Done. ' + fileCount + ' files installed.');
  log('');
  log('Next steps:');
  log('');
  log('  1. Open .agents/memory/system-context.md');
  log('     Fill in your system type (ERP, SaaS, CMS, Mobile) and architecture.');
  log('');
  log('  2. Tell your AI agent:');
  log('     "Read .agents/memory/system-context.md and proceed with the task."');
  log('');
  log('  3. To generate a new module:');
  log('     "Use fullstack-module-generator to create a [module] module."');
  log('');
}

function cmdVersion() {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    log(PACKAGE_NAME + ' v' + pkg.version);
  } catch {
    log(PACKAGE_NAME + ' (version unknown)');
  }
}

function cmdHelp() {
  log('');
  log('Usage: npx ' + PACKAGE_NAME + ' <command> [options]');
  log('');
  log('Commands:');
  log('');
  log('  install            Install the .agents/ system into your current project');
  log('  install --force    Overwrite an existing .agents/ installation');
  log('  version            Show the current gravix version');
  log('  help               Show this help message');
  log('');
  log('Examples:');
  log('');
  log('  npx gravix install');
  log('  npx gravix install --force');
  log('  npx gravix version');
  log('');
  log('After installation, open .agents/memory/system-context.md to configure your project.');
  log('Read the README.md for full documentation.');
  log('');
}

// ─── Entry Point ─────────────────────────────────────────────────────────────

const command = process.argv[2];
const args    = process.argv.slice(3);

switch (command) {
  case 'install':
    cmdInstall(args);
    break;

  case 'version':
  case '-v':
  case '--version':
    cmdVersion();
    break;

  case 'help':
  case '-h':
  case '--help':
  case undefined:
    cmdHelp();
    break;

  default:
    logError('Unknown command: ' + command);
    log('');
    log('Run "npx gravix help" to see available commands.');
    process.exit(1);
}
