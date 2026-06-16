# Domain Shard 01 · Global CLI Installation

## Objective

Make REASP callable as a global terminal command (`reasp`) instead of requiring `cd installer && node index.js`.

## Implementation

### 1. Root `package.json`

Create `C:\Users\kevin\Keorsoft\0Development\AITools\REASP\package.json`:

```json
{
  "name": "reasp-cli",
  "version": "1.0.0",
  "description": "REASP · Global installer, SDD orchestrator, and agent backup manager",
  "type": "module",
  "bin": {
    "reasp": "./installer/index.js"
  },
  "scripts": {
    "test": "node --check installer/index.js && node --check installer/lib/**/*.js"
  },
  "preferGlobal": true,
  "files": [
    "installer/",
    ".opencode/",
    "README.md",
    "LICENSE.md"
  ],
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": ["reasp", "rass", "refi", "ai-agent", "cli", "backup"],
  "author": "Kevin Keor",
  "license": "SEE LICENSE IN LICENSE.md"
}
```

### 2. Entry point compatibility

`installer/index.js` is already an ES module. Ensure the shebang is present:

```js
#!/usr/bin/env node
```

Add at the very top of `installer/index.js` if not present.

### 3. Cross-platform wrapper (optional)

Create `scripts/reasp.cmd` for Windows:

```batch
@echo off
node "%~dp0..\installer\index.js" %*
```

And `scripts/reasp` for Unix:

```bash
#!/usr/bin/env bash
node "$(dirname "$0")/../installer/index.js" "$@"
```

These allow users to add `scripts/` to PATH without `npm -g`.

### 4. Detect global vs local execution

In `installer/index.js`, expose the actual install source directory regardless of where the CLI is executed from:

```js
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.resolve(__dirname, '..', '.opencode');
```

This already exists; verify it remains correct when executed from a global npm bin symlink.

### 5. Installation instructions in README

Document:

```bash
# From repo root
npm install -g .

# Or by path
npm install -g C:\Users\kevin\Keorsoft\0Development\AITools\REASP

# Verify
reasp --help
reasp detect
```

## Verification Gate

- `npm install -g .` succeeds.
- `reasp --help` prints usage.
- `reasp detect` runs from any directory and detects installed agents.
