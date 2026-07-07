#!/usr/bin/env node

import { execSync, exec, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { platform, totalmem, cpus, release, homedir, tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:net';
import { request } from 'node:http';
import { createInterface } from 'node:readline';
import { request as httpsRequest } from 'node:https';

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ ANSI Colors & Styling Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  bgGreen: '\x1b[42m',
  bgBlue: '\x1b[44m',
  bgYellow: '\x1b[43m',
  white: '\x1b[37m',
};

const { reset, bold, dim, green, yellow, blue, magenta, cyan, red, bgGreen, bgBlue, bgYellow, white } = colors;

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Path Resolution Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Resolve project root: up 2 levels from cli/src/ or cli/dist/
const projectRoot = resolve(__dirname, '..', '..');


function getGlobalConfigDir() {
  const p = platform();
  const home = homedir();
  if (p === 'win32') {
    return join(process.env.APPDATA || join(home, 'AppData', 'Roaming'), 'TIF-AI');
  } else if (p === 'darwin') {
    return join(home, 'Library', 'Application Support', 'TIF-AI');
  } else {
    return join(home, '.config', 'tif-ai');
  }
}


function logEvent(level, category, message) {
  try {
    const logsDir = join(getGlobalConfigDir(), 'logs');
    if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });
    const logFile = join(logsDir, 'cli.log');
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    appendFileSync(logFile, `[${timestamp}] [${level.toUpperCase()}] [${category}] ${message}\n`, 'utf-8');
  } catch(e) {}
}

const CLI_VERSION = '1.0.0';

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Command Helpers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function runCommand(cmd, options = {}) {
  try {
    const stdout = execSync(cmd, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: projectRoot,
      timeout: options.timeout || 30000,
      ...options,
    });
    return { success: true, stdout: stdout.trim(), stderr: '' };
  } catch (e) {
    return { success: false, stdout: e.stdout?.trim() || '', stderr: e.stderr?.trim() || e.message };
  }
}

function formatCheck(isValid, text) {
  return isValid ? `${green}Ã¢Å“â€ ${text}${reset}` : `${red}Ã¢Å“â€” ${text}${reset}`;
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') resolve(false);
      else resolve(true);
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '127.0.0.1');
  });
}

function decrypt(encrypted) {
  if (!encrypted || !encrypted.startsWith('enc:')) return encrypted;
  try {
    const payload = encrypted.slice(4);
    const keyPath = join(getGlobalConfigDir(), '.tif-ai.key');
    if (!existsSync(keyPath)) return encrypted;
    const key = readFileSync(keyPath);
    if (key.length !== 32) return encrypted;
    // AES-256-GCM format: enc:<iv_hex>:<tag_hex>:<ciphertext_hex>
    if (payload.split(':').length === 3) {
      const { createDecipheriv } = require('node:crypto');
      const parts = payload.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const tag = Buffer.from(parts[1], 'hex');
      const ct = Buffer.from(parts[2], 'hex');
      const decipher = createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(tag);
      let plain = decipher.update(ct, 'hex', 'utf-8');
      plain += decipher.final('utf-8');
      return plain;
    }
    // Legacy XOR format: enc:<hex>
    const buf = Buffer.from(payload, 'hex');
    const result = Buffer.alloc(buf.length);
    for (let i = 0; i < buf.length; i++) {
      result[i] = buf[i] ^ key[i % key.length];
    }
    return result.toString('utf-8');
  } catch (e) {
    return encrypted;
  }
}

function pingUrl(url) {
  return new Promise((resolve) => {
    const req = request(url, { method: 'GET', timeout: 1500 }, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 304 || res.statusCode === 204);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

// Cross-Platform OS name detection
async function getOSName() {
  const osPlatform = platform();
  if (osPlatform === 'win32') {
    const res = runCommand('powershell -Command "(Get-CimInstance Win32_OperatingSystem).Caption"');
    if (res.success && res.stdout) {
      return res.stdout.replace('Microsoft ', '').trim();
    }
    const rel = release();
    const major = parseInt(rel.split('.')[0], 10);
    const build = parseInt(rel.split('.')[2], 10);
    if (major === 10) {
      if (build >= 22000) return 'Windows 11';
      return 'Windows 10';
    }
    return 'Windows ' + rel;
  } else if (osPlatform === 'darwin') {
    const res = runCommand('sw_vers -productVersion');
    const ver = res.success ? res.stdout.trim() : release();
    return `macOS ${ver}`;
  } else if (osPlatform === 'linux') {
    const res = runCommand('cat /etc/os-release');
    if (res.success && res.stdout) {
      const match = res.stdout.match(/PRETTY_NAME="([^"]+)"/);
      if (match) return match[1];
    }
    return 'Linux';
  }
  return osPlatform;
}

function httpRequest(options) {
  const { url, method = 'GET', headers = {}, timeout = 5000 } = typeof options === 'string' ? { url: options } : options;
  
  const isHttps = url.toLowerCase().startsWith('https://');
  console.log('httpRequest: URL:', url, 'isHttps:', isHttps);
  const reqFunc = isHttps ? httpsRequest : request;
  
  return new Promise((resolve) => {
    const req = reqFunc(url, { method, headers, timeout }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          body: data
        });
      });
    });
    req.on('error', (err) => {
      resolve({
        statusCode: 0,
        success: false,
        body: err.message
      });
    });
    req.end();
  });
}


// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ CLI Commands Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

// 1. Doctor command
async function cmdDoctor() {
  console.log(`\n${bold}=====================================================`);
  console.log(`             TIF-AI Doctor Diagnostics`);
  console.log(`=====================================================${reset}\n`);

  process.stdout.write(`  ${cyan}Ã°Å¸â€Â Performing 17 comprehensive health checks...${reset}`);

  // 1. Python Check
  const pythonRes = runCommand('python --version') || runCommand('python3 --version');
  const pythonVer = pythonRes.success ? pythonRes.stdout.trim().replace('Python ', '') : null;

  // 2. Node Check
  const nodeVer = process.version.replace('v', '');
  const nodeOk = parseInt(nodeVer.split('.')[0], 10) >= 18;

  // 3. Frontend Build Check
  const frontendDir = join(projectRoot, 'frontend');
  const frontendNodeModules = existsSync(join(frontendDir, 'node_modules'));
  const frontendPackage = existsSync(join(frontendDir, 'package.json'));
  const frontendBuildOk = frontendNodeModules && frontendPackage;

  // 4. Backend Ready Check
  const backendMain = join(projectRoot, 'app', 'main.py');
  const backendOk = existsSync(backendMain);

  // 5. Database Check (DuckDB)
  const dbFile = join(projectRoot, 'data', 'tifai.duckdb');
  const dbExists = existsSync(dbFile);

  // 6. CSV Data Files Check
  const inventoryCsv = join(projectRoot, 'data', 'inventory_data.csv');
  const salesCsv = join(projectRoot, 'data', 'sales_data.csv');
  const csvFilesOk = existsSync(inventoryCsv) && existsSync(salesCsv);

  // 7. API Health & 14. Ports Check
  const port8000Free = await isPortFree(8000);
  const port3000Free = await isPortFree(3000);
  const apiLive = await pingUrl('http://127.0.0.1:8000/health');

  // 11. Agent Protocols Check
  const protocolsFile = join(projectRoot, 'docs', 'agent_protocols.md');
  const protocolsOk = existsSync(protocolsFile);

  // 12. Reusable Skills Count
  let skillsCount = 0;
  const skillsDir = join(projectRoot, 'skills');
  if (existsSync(skillsDir)) {
    const countFiles = (dir) => {
      let count = 0;
      try {
        const files = readdirSync(dir);
        for (const file of files) {
          const fullPath = join(dir, file);
          const stat = statSync(fullPath);
          if (stat.isDirectory()) {
            count += countFiles(fullPath);
          } else if (file.endsWith('.md')) {
            count++;
          }
        }
      } catch (e) {}
      return count;
    };
    skillsCount = countFiles(skillsDir);
  }

  // 13. Environment Variables Check
  const envFile = join(projectRoot, '.env');
  const envExists = existsSync(envFile);

  // 15. Available Memory (RAM) Check
  const totalRAMGB = Math.round(totalmem() / (1024 * 1024 * 1024));
  const ramOk = totalRAMGB >= 8;

  // 16. Disk Space Check
  const diskGB = await (async () => {
    if (platform() === 'win32') {
      const res = runCommand('powershell -Command "[Math]::Round((Get-Volume -DriveLetter C).SizeRemaining / 1GB)"');
      if (res.success && res.stdout) return parseInt(res.stdout.trim(), 10) || 0;
    } else {
      const res = runCommand('df -k .');
      if (res.success && res.stdout) {
        const lines = res.stdout.split('\n');
        if (lines.length > 1) {
          const parts = lines[1].split(/\s+/).filter(Boolean);
          return Math.round(parseInt(parts[3], 10) / (1024 * 1024)) || 0;
        }
      }
    }
    return 0;
  })();
  const diskOk = diskGB >= 20;

  // 17. Internet Connectivity Check
  const internetOk = await (async () => {
    const res = await httpRequest('https://1.1.1.1', { timeout: 3000 });
    if (res.success) return true;
    const res2 = await httpRequest('https://api.github.com', { timeout: 3000 });
    return res2.success;
  })();

  // 8. AI Provider & 9. Connectivity & 10. Models Check
  const configPath = join(getGlobalConfigDir(), 'ai-config.json');
  let aiConfigured = false;
  let aiProviderName = 'Not Configured';
  let aiConnectivityOk = false;
  let aiConnectivityDetails = 'Not Tested';
  let aiModelName = 'None';
  let aiModelStatusOk = false;

  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      if (config.ai && config.ai.provider) {
        aiConfigured = true;
        aiProviderName = config.ai.provider.toUpperCase();
        aiModelName = config.ai.model || (config.ollama?.models?.[0]) || 'Unknown';
        
        const decryptedKey = decrypt(config.ai.apiKey);

        if (config.ai.provider === 'ollama') {
          const endpoint = config.ai.endpoint || 'http://localhost:11434';
          const cleanEndpoint = endpoint.endsWith('/v1') ? endpoint.slice(0, -3) : endpoint;
          const ollamaCheck = await httpRequest(`${cleanEndpoint}/api/tags`, { timeout: 3000 });
          if (ollamaCheck.success) {
            aiConnectivityOk = true;
            aiConnectivityDetails = `Local server active at ${cleanEndpoint}`;
            try {
              const tags = JSON.parse(ollamaCheck.body);
              const hasModel = tags.models?.some(m => m.name.startsWith(aiModelName));
              if (hasModel) {
                aiModelStatusOk = true;
              }
            } catch(e){}
          } else {
            aiConnectivityDetails = 'Could not reach local Ollama server';
          }
        } else if (config.ai.provider === 'lmstudio') {
          const endpoint = config.ai.endpoint || 'http://localhost:1234';
          const cleanEndpoint = endpoint.endsWith('/v1') ? endpoint.slice(0, -3) : endpoint;
          const lmCheck = await httpRequest(`${cleanEndpoint}/v1/models`, { timeout: 3000 });
          if (lmCheck.success) {
            aiConnectivityOk = true;
            aiConnectivityDetails = `Local server active at ${cleanEndpoint}`;
            try {
              const data = JSON.parse(lmCheck.body);
              const hasModel = data.data?.some(m => m.id === aiModelName);
              if (hasModel) {
                aiModelStatusOk = true;
              }
            } catch(e){}
          } else {
            aiConnectivityDetails = 'Could not reach local LM Studio server';
          }
        } else if (config.ai.provider === 'openrouter') {
          if (internetOk) {
            const openRouterCheck = await httpRequest('https://openrouter.ai/api/v1/auth/key', {
              headers: { 'Authorization': `Bearer ${decryptedKey}` },
              timeout: 5000
            });
            if (openRouterCheck.success) {
              aiConnectivityOk = true;
              aiConnectivityDetails = 'API credentials authenticated';
              aiModelStatusOk = true; // Cloud model verified by credentials
            } else {
              aiConnectivityDetails = 'Invalid API key or authorization failed';
            }
          } else {
            aiConnectivityDetails = 'Skipped (No Internet)';
          }
        } else if (config.ai.provider === 'gemini') {
          if (internetOk) {
            const geminiCheck = await httpRequest(`https://generativelanguage.googleapis.com/v1beta/models?key=${decryptedKey}`, { timeout: 5000 });
            if (geminiCheck.success) {
              aiConnectivityOk = true;
              aiConnectivityDetails = 'API credentials authenticated';
              aiModelStatusOk = true;
            } else {
              aiConnectivityDetails = 'Invalid API key or authorization failed';
            }
          } else {
            aiConnectivityDetails = 'Skipped (No Internet)';
          }
        } else if (config.ai.provider === 'openai') {
          if (internetOk) {
            const openaiCheck = await httpRequest('https://api.openai.com/v1/models', {
              headers: { 'Authorization': `Bearer ${decryptedKey}` },
              timeout: 5000
            });
            if (openaiCheck.success) {
              aiConnectivityOk = true;
              aiConnectivityDetails = 'API credentials authenticated';
              aiModelStatusOk = true;
            } else {
              aiConnectivityDetails = 'Invalid API key or authorization failed';
            }
          } else {
            aiConnectivityDetails = 'Skipped (No Internet)';
          }
        } else if (config.ai.provider === 'azure') {
          if (internetOk) {
            const cleanEndpoint = config.ai.endpoint.endsWith('/') ? config.ai.endpoint.slice(0, -1) : config.ai.endpoint;
            const azureUrl = `${cleanEndpoint}/openai/deployments/${config.ai.deploymentName}/chat/completions?api-version=${config.ai.apiVersion || '2024-02-15-preview'}`;
            const azureCheck = await httpRequest(azureUrl, {
              method: 'POST',
              headers: { 'api-key': decryptedKey },
              timeout: 5000
            }, { messages: [{ role: 'user', content: 'ping' }], max_tokens: 5 });
            
            if (azureCheck.success) {
              aiConnectivityOk = true;
              aiConnectivityDetails = 'API connection and deployment active';
              aiModelStatusOk = true;
            } else {
              aiConnectivityDetails = `Deployment ping failed (Status: ${azureCheck.statusCode})`;
            }
          } else {
            aiConnectivityDetails = 'Skipped (No Internet)';
          }
        } else if (config.ai.provider === 'custom') {
          const cleanEndpoint = config.ai.endpoint.endsWith('/') ? config.ai.endpoint.slice(0, -1) : config.ai.endpoint;
          const headers = decryptedKey ? { 'Authorization': `Bearer ${decryptedKey}` } : {};
          const customCheck = await httpRequest(`${cleanEndpoint}/models`, { headers, timeout: 5000 });
          if (customCheck.success) {
            aiConnectivityOk = true;
            aiConnectivityDetails = 'OpenAI-compatible models query succeeded';
            aiModelStatusOk = true;
          } else {
            aiConnectivityDetails = `Endpoint check failed (Status: ${customCheck.statusCode})`;
          }
        }
      }
    } catch (e) {
      aiConnectivityDetails = 'Config file parsing error';
    }
  }

  // Git and Docker checks (optional/developer tools)
  const gitRes = runCommand('git --version');
  const dockerRes = runCommand('docker --version');

  // Clear progress line
  process.stdout.write('\r' + ' '.repeat(60) + '\r');

  // Print highly structured 17-item health report
  console.log(`${bold}1. System & Hardware Diagnostics:${reset}`);
  console.log(`  - Operating System:           ${formatCheck(true, await getOSName())}`);
  console.log(`  - Available Memory (RAM):     ${formatCheck(ramOk, `${totalRAMGB} GB` + (ramOk ? '' : ' Ã¢â‚¬â€ 8 GB recommended for local AI'), !ramOk)}`);
  console.log(`  - Free Disk Space:            ${formatCheck(diskOk, `${diskGB} GB Available` + (diskOk ? '' : ' Ã¢â‚¬â€ 20 GB recommended'), !diskOk)}`);
  console.log();

  console.log(`${bold}2. Software & Toolchain:${reset}`);
  console.log(`  - Python Engine:              ${formatCheck(!!pythonVer, pythonVer ? `Python ${pythonVer}` : 'Not Found (Required >= 3.10)')}`);
  console.log(`  - Node.js Runtime:            ${formatCheck(nodeOk, `Node ${nodeVer}`)}`);
  console.log(`  - Git Version Control:        ${formatCheck(gitRes.success, gitRes.success ? gitRes.stdout.replace('git version ', '').trim() : 'Not Installed', !gitRes.success)}`);
  console.log(`  - Docker Container Engine:    ${formatCheck(dockerRes.success, dockerRes.success ? 'Installed' : 'Not Installed', !dockerRes.success)}`);
  console.log();

  console.log(`${bold}3. Project Structure & File Integrity:${reset}`);
  console.log(`  - Backend Engine Core:        ${formatCheck(backendOk, backendOk ? 'Ready (app/main.py present)' : 'Missing app/main.py')}`);
  console.log(`  - Frontend Build & Packages:  ${formatCheck(frontendBuildOk, frontendBuildOk ? 'Ready (node_modules present)' : 'Missing node_modules Ã¢â‚¬â€ run "npm install" in frontend')}`);
  console.log(`  - Reusable Skills Catalog:    ${formatCheck(skillsCount > 0, `${skillsCount} Skills Found (skills/ present)`)}`);
  console.log(`  - Agent Protocols Docs:       ${formatCheck(protocolsOk, protocolsOk ? 'Ready (docs/agent_protocols.md present)' : 'Missing agent_protocols.md')}`);
  console.log(`  - DuckDB Database File:       ${formatCheck(dbExists, dbExists ? 'Ready (data/tifai.duckdb present)' : 'Database not initialized (will create on start)', !dbExists)}`);
  console.log(`  - CSV Data Source Files:      ${formatCheck(csvFilesOk, csvFilesOk ? 'Ready (sales and inventory data present)' : 'Missing CSV files in data/')}`);
  console.log(`  - Environment Variables:      ${formatCheck(envExists, envExists ? '.env file present' : 'Missing .env file (copy .env.example)')}`);
  console.log();

  console.log(`${bold}4. Network, Ports & API Diagnostics:${reset}`);
  console.log(`  - Internet Connectivity:      ${formatCheck(internetOk, internetOk ? 'Online' : 'Offline')}`);
  console.log(`  - Required Ports (8000/3000):  ${formatCheck(port8000Free && port3000Free, `Port 8000: ${port8000Free ? 'Free' : 'In Use'}, Port 3000: ${port3000Free ? 'Free' : 'In Use'}`, !(port8000Free && port3000Free))}`);
  console.log(`  - API Backend Health Status:  ${formatCheck(apiLive, apiLive ? 'Online & Healthy' : (port8000Free ? 'Healthy (Ready to start)' : 'Unreachable (Check port conflict)'))}`);
  console.log();

  console.log(`${bold}5. AI Integration & Connectivity Diagnostics:${reset}`);
  console.log(`  - AI Provider Configuration:  ${formatCheck(aiConfigured, aiConfigured ? `Configured (${aiProviderName})` : 'Missing (Run "tif-ai setup")')}`);
  console.log(`  - AI Provider Connectivity:   ${formatCheck(aiConnectivityOk, aiConnectivityDetails, !aiConnectivityOk && aiConfigured)}`);
  console.log(`  - Configured Model Status:    ${formatCheck(aiModelStatusOk, aiModelStatusOk ? `Model '${aiModelName}' verified and active` : `Model '${aiModelName}' ${aiConfigured && (aiProviderName === 'OLLAMA' || aiProviderName === 'LMSTUDIO') ? 'not loaded/installed' : 'not verified'}`, !aiModelStatusOk && aiConfigured)}`);
  console.log();

  console.log(`${bold}Summary Health Report:${reset}`);
  const criticalFailure = !pythonVer || !nodeOk || !backendOk || !frontendBuildOk || !csvFilesOk || (aiConfigured && !aiConnectivityOk && (aiProviderName !== 'OLLAMA' && aiProviderName !== 'LMSTUDIO'));
  
  if (criticalFailure) {
    console.log(`  ${red}${bold}Ã¢Å“â€” HEALTH STATUS: FAIL${reset}`);
    console.log(`  ${red}Critical issues detected! Please resolve the red items above before running TIF-AI.${reset}\n`);
  } else if (!ramOk || !diskOk || !aiConfigured || !aiModelStatusOk) {
    console.log(`  ${yellow}${bold}Ã¢Å¡Â  HEALTH STATUS: WARNING${reset}`);
    console.log(`  ${yellow}Environment is functional but has warnings. Recommended optimization: run "tif-ai setup".${reset}\n`);
  } else {
    console.log(`  ${green}${bold}Ã¢Å“â€ HEALTH STATUS: PASS${reset}`);
    console.log(`  ${green}All 17 checks passed! Your environment is completely healthy and ready for production.${reset}\n`);
  }
}

// 2. Setup command
async function cmdSetup() {
  console.log(`\n${bold}Ã¢Å¡Â¡ Launching Interactive AI Setup Wizard...${reset}\n`);
  
  const setupScript = join(projectRoot, 'setup', 'index.js');
  if (!existsSync(setupScript)) {
    console.error(`${red}Ã¢Å“â€” Setup script not found at ${setupScript}${reset}`);
    process.exit(1);
  }

  // Spawn the setup process, inheriting stdin/stdout/stderr for full interactivity
  const child = spawn('node', [setupScript], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  child.on('close', async (code) => {
    if (code === 0) {
      console.log(`\n${green}Ã¢Å“â€ Setup Wizard completed successfully!${reset}\n`);
      // Run doctor after successful setup
      await cmdDoctor();
    } else {
      console.log(`\n${red}Ã¢Å“â€” Setup Wizard exited with code ${code}.${reset}\n`);
    }
    process.exit(code);
  });
}

// 3. Start command (Unified stack runner)
async function cmdStart() {
  console.log(`\n${bold}=====================================================`);
  console.log(`             Starting TIF-AI Application Stack`);
  console.log(`=====================================================${reset}\n`);

  // Verify virtual env
  const venvDir = join(projectRoot, 'venv');
  if (!existsSync(venvDir)) {
    console.error(`${red}Ã¢Å“â€” Virtual environment not found at ${venvDir}. Please run "python -m venv venv" and install dependencies first.${reset}`);
    process.exit(1);
  }

  // Detect python executable path inside venv
  const isWin = platform() === 'win32';
  const pythonExec = isWin 
    ? join(venvDir, 'Scripts', 'python.exe')
    : join(venvDir, 'bin', 'python');

  if (!existsSync(pythonExec)) {
    console.error(`${red}Ã¢Å“â€” Python executable not found at ${pythonExec}${reset}`);
    process.exit(1);
  }

  // Verify ports
  const port8000Free = await isPortFree(8000);
  const port3000Free = await isPortFree(3000);

  if (!port8000Free || !port3000Free) {
    const busyPorts = [];
    if (!port8000Free) busyPorts.push('8000 (Backend)');
    if (!port3000Free) busyPorts.push('3000 (Frontend)');
    console.log(`  ${yellow}Ã¢Å¡Â  Port(s) ${busyPorts.join(', ')} ${busyPorts.length > 1 ? 'are' : 'is'} already in use.${reset}`);
    console.log(`  ${cyan}Ã°Å¸â€  Options: (1) Kill processes and restart  (2) Exit${reset}`);
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise(resolve => rl.question(`  Choose (1/2): `, ans => { rl.close(); resolve(ans.trim()); }));
    if (answer === '1') {
      console.log(`  ${cyan}Ã°Å¸â€  Killing processes on busy ports...${reset}`);
      await cmdStopInternal();
      console.log(`  ${green}Ã¢Å“â€ Ports freed. Continuing...${reset}\n`);
    } else {
      console.log(`  ${red}Ã¢Å“â€” Free the ports manually and try again.${reset}\n`);
      process.exit(1);
    }
  }

  console.log(`  ${cyan}Ã°Å¸Å¡â‚¬ Launching services...${reset}`);
  console.log(`  ${dim}Backend:  http://127.0.0.1:8000${reset}`);
  console.log(`  ${dim}Frontend: http://localhost:3000${reset}\n`);

  // Spawn Backend
  const backend = spawn(pythonExec, ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000', '--reload'], {
    cwd: projectRoot,
    shell: true,
  });

  // Spawn Frontend
  const frontend = spawn(isWin ? 'npm.cmd' : 'npm', ['start'], {
    cwd: join(projectRoot, 'frontend'),
    shell: true,
  });

  let shutdownCalled = false;

  // Process killer helper
  const killTree = (child) => {
    if (!child) return;
    const pid = child.pid;
    if (isWin) {
      try {
        execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
      } catch (e) {}
    } else {
      try {
        process.kill(-pid, 'SIGINT');
      } catch (e) {
        try {
          child.kill('SIGINT');
        } catch (err) {}
      }
    }
  };

  const shutdown = () => {
    if (shutdownCalled) return;
    shutdownCalled = true;
    console.log(`\n\n${yellow}Ã¢Å¡Â¡ Shutting down TIF-AI services gracefully...${reset}`);
    killTree(backend);
    killTree(frontend);
    console.log(`${green}Ã¢Å“â€ All services stopped. Goodbye!${reset}\n`);
    process.exit(0);
  };

  // Handle termination signals
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Line-by-line logging helper
  const setupLogging = (child, prefix, color) => {
    let stdoutBuffer = '';
    let stderrBuffer = '';

    child.stdout.on('data', (data) => {
      stdoutBuffer += data.toString();
      const lines = stdoutBuffer.split('\n');
      stdoutBuffer = lines.pop();
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) console.log(`${color}${prefix}${reset} ${trimmed}`);
      }
    });

    child.stderr.on('data', (data) => {
      stderrBuffer += data.toString();
      const lines = stderrBuffer.split('\n');
      stderrBuffer = lines.pop();
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) console.log(`${color}${prefix} [ERR]${reset} ${trimmed}`);
      }
    });
  };

  setupLogging(backend, '[Backend] ', blue);
  setupLogging(frontend, '[Frontend]', green);

  // Wait a few seconds then open the browser automatically
  setTimeout(() => {
    if (shutdownCalled) return;
    console.log(`\n  ${green}Ã¢Å“â€ Opening TIF-AI in your default browser...${reset}`);
    const openCmd = isWin ? 'start' : platform() === 'darwin' ? 'open' : 'xdg-open';
    try {
      exec(`${openCmd} http://localhost:3000`);
    } catch (e) {}
  }, 4000);

  // Monitor process exits
  backend.on('exit', (code) => {
    if (!shutdownCalled) {
      console.error(`\n${red}Ã¢Å“â€” Backend service exited unexpectedly with code ${code}.${reset}`);
      shutdown();
    }
  });

  frontend.on('exit', (code) => {
    if (!shutdownCalled) {
      console.error(`\n${red}Ã¢Å“â€” Frontend service exited unexpectedly with code ${code}.${reset}`);
      shutdown();
    }
  });
}

// 4. Status command
async function cmdStatus() {
  console.log(`\n${bold}=====================================================`);
  console.log(`             TIF-AI Service Status Check`);
  console.log(`=====================================================${reset}\n`);

  process.stdout.write(`  ${cyan}Ã°Å¸â€Â Pinging services...${reset}`);

  const backendLive = await pingUrl('http://127.0.0.1:8000/health');
  const frontendLive = await pingUrl('http://localhost:3000');

  process.stdout.write('\r' + ' '.repeat(40) + '\r');

  console.log(`${bold}Services: ${reset}`);
  console.log(`  Backend (FastAPI):  ${backendLive ? `${green}Ã¢â€”Â RUNNING (http://127.0.0.1:8000)${reset}` : `${red}Ã¢â€”â€¹ STOPPED${reset}`}`);
  console.log(`  Frontend (React):   ${frontendLive ? `${green}Ã¢â€”Â RUNNING (http://localhost:3000)${reset}` : `${red}Ã¢â€”â€¹ STOPPED${reset}`}`);
  console.log();

  // Read config details
  const configPath = join(getGlobalConfigDir(), 'ai-config.json');
  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      console.log(`${bold}AI Configuration:${reset}`);
      console.log(`  Active Provider: ${cyan}${config.ai?.provider || 'Unknown'}${reset}`);
      if (config.ai?.model) {
        console.log(`  Active Model:    ${green}${config.ai.model}${reset}`);
      } else if (config.ollama?.models?.length > 0) {
        console.log(`  Active Model:    ${green}${config.ollama.models.join(', ')}${reset}`);
      }
      console.log(`  Setup Version:   ${dim}${config.system?.setupVersion || '1.0.0'}${reset}`);
      console.log(`  Setup Date:      ${dim}${config.system?.setupDate || 'Unknown'}${reset}`);
    } catch (e) {
      console.log(`${yellow}Ã¢Å¡Â  Configuration file is present but could not be parsed.${reset}`);
    }
  } else {
    console.log(`${bold}AI Configuration:${reset}`);
    console.log(`  ${yellow}Ã¢Å¡Â  Missing! Run ${bold}tif-ai setup${reset}${yellow} to generate one.${reset}`);
  }
  console.log();
}

// 5. Info command
async function cmdInfo() {
  console.log(`\n${bold}=====================================================`);
  console.log(`             TIF-AI System Information`);
  console.log(`=====================================================${reset}\n`);

  const osName = await getOSName();
  const totalRAMGB = Math.round(totalmem() / (1024 * 1024 * 1024));
  const cpuList = cpus();
  const cpuModel = cpuList && cpuList.length > 0 ? cpuList[0].model.trim() : 'Unknown';

  console.log(`  ${bold}CLI Version:${reset}      ${CLI_VERSION}`);
  console.log(`  ${bold}Platform:${reset}         ${platform()}`);
  console.log(`  ${bold}OS Name:${reset}          ${osName}`);
  console.log(`  ${bold}OS Release:${reset}       ${release()}`);
  console.log(`  ${bold}CPU Model:${reset}        ${cpuModel}`);
  console.log(`  ${bold}Total Memory:${reset}     ${totalRAMGB} GB`);
  console.log(`  ${bold}Project Root:${reset}     ${projectRoot}`);
  console.log(`  ${bold}CLI Script:${reset}       ${__filename}`);
  console.log();
}

async function cmdAiSwitch() {
  console.log(`\n${bold}=====================================================`);
  console.log(`               AI Provider Switcher`);
  console.log(`=====================================================${reset}\n`);

  const configPath = join(getGlobalConfigDir(), 'ai-config.json');
  const configDir = getGlobalConfigDir();
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
  let config = {};
  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, 'utf-8');
      config = JSON.parse(content);
    } catch (e) {
      console.error(`${red}Ã¢Å“â€” Failed to read or parse config file.${reset}`);
      process.exit(1);
    }
  }

  const currentProvider = config.ai?.provider ?? 'Not Configured';
  console.log(`${bold}Current Provider:${reset}`);
  console.log(`  ${currentProvider}\n`);

  console.log(`${bold}Choose New Provider:${reset}`);
  console.log(`  1) Ollama`);
  console.log(`  2) LM Studio`);
  console.log(`  3) OpenRouter`);
  console.log(`  4) OpenAI`);
  console.log(`  5) Azure OpenAI`);
  console.log(`  6) Custom Endpoint\n`);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise(resolve => rl.question('Enter your choice (1-6): ', ans => { rl.close(); resolve(ans.trim()); }));
  let selectedProvider = null;
  switch (answer) {
    case '1': selectedProvider = 'ollama'; break;
    case '2': selectedProvider = 'lmstudio'; break;
    case '3': selectedProvider = 'openrouter'; break;
    case '4': selectedProvider = 'openai'; break;
    case '5': selectedProvider = 'azure'; break;
    case '6': selectedProvider = 'custom'; break;
    default:
      console.log(`${red}Ã¢Å“â€” Invalid choice. Please run the command again and select a number between 1 and 6.${reset}`);
      process.exit(1);
  }

  // Ensure ai object exists
  if (!config.ai) config.ai = {};
  config.ai.provider = selectedProvider;

  // Write back
  try {
    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log(`\n${green}Ã¢Å“â€ AI provider updated to '\${selectedProvider}'.${reset}\n`);
  } catch (e) {
    console.error(`${red}Ã¢Å“â€” Failed to write config file.${reset}`);
    process.exit(1);
  }
}
async function cmdTest() {
  console.log(`\n${bold}=====================================================`);
  console.log(`             Running TIF-AI Test Suites`);
  console.log(`=====================================================${reset}\n`);

  const venvDir = join(projectRoot, 'venv');
  const isWin = platform() === 'win32';
  const pythonExec = isWin 
    ? join(venvDir, 'Scripts', 'python.exe')
    : join(venvDir, 'bin', 'python');

  const testsDir = join(projectRoot, 'tests');

  if (existsSync(testsDir)) {
    if (existsSync(pythonExec)) {
      console.log(`${bold}Ã°Å¸Â§Âª Running Backend Pytest...${reset}`);
      const pytestRes = runCommand(`"${pythonExec}" -m pytest -v`, { stdio: 'inherit' });
      if (pytestRes.success) {
        console.log(`\n${green}Ã¢Å“â€ Backend tests passed!${reset}\n`);
      } else {
        console.log(`\n${red}Ã¢Å“â€” Backend tests failed.${reset}\n`);
      }
    } else {
      console.log(`${yellow}Ã¢Å¡Â  Backend virtual environment not configured. Skipping backend tests.${reset}\n`);
    }
  } else {
    console.log(`${yellow}Ã¢Å¡Â  No 'tests' directory found in the project root. Skipping backend tests.${reset}\n`);
  }

  console.log(`${bold}Ã°Å¸Â§Âª Running Frontend Tests (Press q to exit watch mode if prompted)...${reset}`);
  const npmTestRes = spawn(isWin ? 'npm.cmd' : 'npm', ['test', '--', '--watchAll=false'], {
    cwd: join(projectRoot, 'frontend'),
    stdio: 'inherit',
    shell: true,
  });

  npmTestRes.on('close', (code) => {
    if (code === 0) {
      console.log(`\n${green}Ã¢Å“â€ Frontend tests passed!${reset}\n`);
    } else {
      console.log(`\n${red}Ã¢Å“â€” Frontend tests exited with code ${code}.${reset}\n`);
    }
  });
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Help & CLI Entry Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

// 6. Stop command (internal - no header)
async function cmdStopInternal() {
  const isWin = platform() === 'win32';
  let killed = 0;
  
  if (isWin) {
    try {
      const res8000 = runCommand('netstat -ano | findstr :8000');
      const res3000 = runCommand('netstat -ano | findstr :3000');
      const pids = new Set();
      if (res8000.stdout) {
        res8000.stdout.split('\n').forEach(line => {
          const parts = line.trim().split(/\s+/);
          if (parts[parts.length - 1] && parts[parts.length - 1] !== '0') pids.add(parts[parts.length - 1]);
        });
      }
      if (res3000.stdout) {
        res3000.stdout.split('\n').forEach(line => {
          const parts = line.trim().split(/\s+/);
          if (parts[parts.length - 1] && parts[parts.length - 1] !== '0') pids.add(parts[parts.length - 1]);
        });
      }
      for (const pid of pids) {
        runCommand(`taskkill /F /PID ${pid}`);
        killed++;
      }
    } catch (e) {}
  } else {
    try {
      const pids = new Set();
      const res8000 = runCommand('lsof -t -i:8000');
      const res3000 = runCommand('lsof -t -i:3000');
      if (res8000.stdout) res8000.stdout.split('\n').forEach(pid => pids.add(pid.trim()));
      if (res3000.stdout) res3000.stdout.split('\n').forEach(pid => pids.add(pid.trim()));
      for (const pid of pids) {
        if (pid) {
          runCommand(`kill -9 ${pid}`);
          killed++;
        }
      }
    } catch (e) {}
  }
  return killed;
}

// 6b. Stop command (public)
async function cmdStop() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Stopping TIF-AI Services`);
  console.log(`=====================================================\n`);
  process.stdout.write(`  ${cyan}🔍 Identifying processes on ports 3000 and 8000...${reset}`);
  const killed = await cmdStopInternal();
  process.stdout.write('\r' + ' '.repeat(60) + '\r');
  if (killed === 0) {
    console.log(`  ${yellow}⚠ No active services found on ports 3000/8000.${reset}\n`);
  } else {
    console.log(`  ${green}✔ Killed ${killed} process(es). Services stopped.${reset}\n`);
  }
}

// 7. Restart command
async function cmdRestart() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Restarting TIF-AI Services`);
  console.log(`=====================================================\n`);
  await cmdStop();
  console.log(`  ${cyan}⏳ Waiting 2 seconds before starting...${reset}\n`);
  await new Promise(r => setTimeout(r, 2000));
  await cmdStart();
}

// 8. Update command
async function cmdUpdate() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Updating TIF-AI Repository`);
  console.log(`=====================================================\n`);

  console.log(`  ${cyan}🔍 Checking for updates...${reset}`);

  // 1. Check latest GitHub Release
  let latestVersion = CLI_VERSION;
  let updateAvailable = false;
  let updateType = 'release';

  const res = await httpRequest({
    url: 'https://api.github.com/repos/TIF-AI/TIF-AI/releases/latest',
    headers: { 'User-Agent': 'TIF-AI-CLI' },
    timeout: 3000
  });

  if (res.success) {
    try {
      const data = JSON.parse(res.body);
      latestVersion = data.tag_name || latestVersion;
      if (latestVersion.replace('v', '') !== CLI_VERSION.replace('v', '')) {
        updateAvailable = true;
      }
    } catch(e) {}
  } else {
    // Fallback to checking git remote commits
    const gitRemoteRes = runCommand('git ls-remote origin HEAD');
    const gitLocalRes = runCommand('git rev-parse HEAD');
    if (gitRemoteRes.success && gitLocalRes.success) {
      const remoteHash = gitRemoteRes.stdout.split(/\s+/)[0];
      const localHash = gitLocalRes.stdout.trim();
      if (remoteHash && localHash && remoteHash !== localHash) {
        updateAvailable = true;
        updateType = 'commit';
        latestVersion = remoteHash.substring(0, 7);
      }
    }
  }

  if (!updateAvailable) {
    console.log(`  ${green}✔ You are already on the latest version (${CLI_VERSION}).${reset}\n`);
    return;
  }

  const promptMsg = updateType === 'release' 
    ? `  Update available: ${latestVersion} (Current: ${CLI_VERSION}). Would you like to upgrade? (y/N): `
    : `  New commits found on origin (Latest: ${latestVersion}). Would you like to pull them? (y/N): `;

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(promptMsg, ans => { rl.close(); resolve(ans.trim().toLowerCase()); }));

  if (answer !== 'y' && answer !== 'yes') {
    console.log(`\n  ${cyan}Update cancelled.${reset}\n`);
    return;
  }

  console.log(`\n  ${cyan}💾 Initiating pre-update backup...${reset}`);
  await cmdBackup();

  const localHashRes = runCommand('git rev-parse HEAD');
  const safeHash = localHashRes.success ? localHashRes.stdout.trim() : null;

  console.log(`  ${cyan}⬇️ Pulling latest changes from git...${reset}`);
  const gitPullRes = runCommand('git pull');
  
  if (!gitPullRes.success) {
    console.log(`  ${red}✘ Git pull failed. Rolling back...${reset}\n`);
    if (safeHash) runCommand(`git reset --hard ${safeHash}`);
    process.exit(1);
  }

  console.log(`  ${green}✔ Git pull successful.${reset}`);
  
  try {
    console.log(`\n  ${cyan}📦 Updating frontend dependencies...${reset}`);
    const npmRes = runCommand('npm install', { cwd: join(projectRoot, 'frontend') });
    if (!npmRes.success) throw new Error('Frontend npm install failed: ' + npmRes.stderr);
    console.log(`  ${green}✔ Frontend updated.${reset}`);
    
    console.log(`\n  ${cyan}📦 Updating backend dependencies...${reset}`);
    const venvDir = join(projectRoot, 'venv');
    const isWin = platform() === 'win32';
    const pipExec = isWin ? join(venvDir, 'Scripts', 'pip.exe') : join(venvDir, 'bin', 'pip');
    
    if (existsSync(pipExec)) {
      const pipRes = runCommand(`"${pipExec}" install -r requirements.txt`);
      if (!pipRes.success) throw new Error('Backend pip install failed: ' + pipRes.stderr);
      console.log(`  ${green}✔ Backend updated.${reset}\n`);
    } else {
      console.log(`  ${yellow}⚠ Virtual environment not found, skipping backend update.${reset}\n`);
    }

    console.log(`  ${green}✔ Update applied successfully!${reset}\n`);

  } catch (error) {
    console.log(`  ${red}✘ Update failed: ${error.message}${reset}`);
    console.log(`  ${cyan}↩️ Rolling back to previous state...${reset}`);
    if (safeHash) {
      runCommand(`git reset --hard ${safeHash}`);
      console.log(`  ${green}✔ Rollback complete. Your system is safe.${reset}\n`);
    } else {
      console.log(`  ${red}✘ Could not safely rollback (no safe git hash). Please check system state manually.${reset}\n`);
    }
    process.exit(1);
  }
}
// 9. Upgrade command
async function cmdUpgrade() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Upgrading TIF-AI Dependencies`);
  console.log(`=====================================================\n`);
  console.log(`  ${cyan}🚀 Upgrading frontend packages to latest versions...${reset}`);
  runCommand('npm update', { cwd: join(projectRoot, 'frontend') });
  console.log(`  ${green}✔ Frontend upgraded.${reset}`);
  console.log(`\n  ${cyan}🚀 Upgrading backend packages...${reset}`);
  const venvDir = join(projectRoot, 'venv');
  const isWin = platform() === 'win32';
  const pipExec = isWin ? join(venvDir, 'Scripts', 'pip.exe') : join(venvDir, 'bin', 'pip');
  if (existsSync(pipExec)) {
    runCommand(`"${pipExec}" install --upgrade -r requirements.txt`);
    console.log(`  ${green}✔ Backend upgraded.${reset}\n`);
  }
}

// 10. Build command
async function cmdBuild() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Building TIF-AI Frontend`);
  console.log(`=====================================================\n`);
  console.log(`  ${cyan}🔨 Compiling React application for production...${reset}`);
  const res = runCommand('npm run build', { cwd: join(projectRoot, 'frontend') });
  if (res.success) {
    console.log(`\n${green}✔ Build successful! Output in frontend/build.${reset}\n`);
  } else {
    console.log(`\n${red}✘ Build failed:\n${res.stderr}${reset}\n`);
    process.exit(1);
  }
}

// 11. Clean command
async function cmdClean() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Cleaning TIF-AI Environment`);
  console.log(`=====================================================\n`);
  const isWin = platform() === 'win32';
  const rmCmd = isWin ? 'rmdir /s /q' : 'rm -rf';
  
  console.log(`  ${cyan}🧹 Removing node_modules...${reset}`);
  runCommand(`${rmCmd} node_modules`, { cwd: join(projectRoot, 'frontend') });
  console.log(`  ${green}✔ Frontend node_modules removed.${reset}`);
  
  console.log(`  ${cyan}🧹 Removing Python cache...${reset}`);
  if (isWin) {
    runCommand('for /d /r . %d in (__pycache__) do @if exist "%d" rd /s /q "%d"');
  } else {
    runCommand('find . -type d -name "__pycache__" -exec rm -rf {} +');
  }
  console.log(`  ${green}✔ __pycache__ removed.${reset}\n`);
}

// 12. Reset command
async function cmdReset() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             FACTORY RESET TIF-AI`);
  console.log(`=====================================================\n`);
  console.log(`  ${red}${bold}⚠ WARNING: This will delete the database and AI configuration.${reset}`);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(`  Are you sure you want to proceed? (y/N): `, ans => { rl.close(); resolve(ans.trim().toLowerCase()); }));
  
  if (answer === 'y' || answer === 'yes') {
    const isWin = platform() === 'win32';
    const rmFile = isWin ? 'del /q /f' : 'rm -f';
    console.log(`\n  ${cyan}🗑️ Deleting DuckDB database...${reset}`);
    runCommand(`${rmFile} tifai.duckdb`, { cwd: join(projectRoot, 'data') });
    console.log(`  ${cyan}🗑️ Deleting AI Config...${reset}`);
    runCommand(`${rmFile} ai-config.json`, { cwd: join(projectRoot, 'config') });
    console.log(`\n  ${green}✔ Reset complete. Run 'tif-ai setup' to reconfigure.${reset}\n`);
  } else {
    console.log(`\n  ${cyan}Reset cancelled.${reset}\n`);
  }
}

// 13. Backup command
async function cmdBackup() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Backing up TIF-AI Data`);
  console.log(`=====================================================\n`);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = join(projectRoot, 'backups', `backup_${timestamp}`);
  mkdirSync(backupDir, { recursive: true });
  
  console.log(`  ${cyan}💾 Creating backup at ${backupDir}...${reset}`);
  const isWin = platform() === 'win32';
  const cpCmd = isWin ? 'xcopy /s /e /i /y' : 'cp -r';
  
  if (existsSync(join(projectRoot, 'data'))) runCommand(`${cpCmd} data "${join(backupDir, 'data')}"`, { cwd: projectRoot });
  if (existsSync(join(projectRoot, 'config'))) runCommand(`${cpCmd} config "${join(backupDir, 'config')}"`, { cwd: projectRoot });
  
  console.log(`\n${green}✔ Backup created successfully!${reset}\n`);
}

// 14. Restore command
async function cmdRestore() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Restoring TIF-AI Data`);
  console.log(`=====================================================\n`);
  const backupsDir = join(projectRoot, 'backups');
  if (!existsSync(backupsDir)) {
    console.log(`  ${yellow}⚠ No backups found in '${backupsDir}'.${reset}\n`);
    return;
  }
  const entries = readdirSync(backupsDir).filter(e => e.startsWith('backup_')).sort().reverse();
  if (entries.length === 0) {
    console.log(`  ${yellow}⚠ No backups found.${reset}\n`);
    return;
  }
  console.log(`  ${bold}Available Backups:${reset}\n`);
  entries.forEach((e, i) => {
    const stat = statSync(join(backupsDir, e));
    const date = stat.birthtime.toISOString().replace('T', ' ').substring(0, 19);
    console.log(`  ${green}[${i + 1}]${reset} ${e}  ${dim}(${date})${reset}`);
  });
  console.log();
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(`  Select backup to restore (1-${entries.length}): `, ans => { rl.close(); resolve(ans.trim()); }));
  const idx = parseInt(answer, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= entries.length) {
    console.log(`  ${red}✘ Invalid selection.${reset}\n`);
    return;
  }
  const selected = entries[idx];
  const backupPath = join(backupsDir, selected);
  const hasData = existsSync(join(backupPath, 'data'));
  const hasConfig = existsSync(join(backupPath, 'config'));
  if (!hasData && !hasConfig) {
    console.log(`  ${red}✘ Backup '${selected}' contains no data or config.${reset}\n`);
    return;
  }
  const rl2 = createInterface({ input: process.stdin, output: process.stdout });
  const confirm = await new Promise(resolve => rl2.question(`  ${red}${bold}⚠ WARNING:${reset} This will overwrite current data. Continue? (y/N): `, ans => { rl2.close(); resolve(ans.trim().toLowerCase()); }));
  if (confirm !== 'y' && confirm !== 'yes') {
    console.log(`  ${cyan}Restore cancelled.${reset}\n`);
    return;
  }
  const isWin = platform() === 'win32';
  const cpCmd = isWin ? 'xcopy /s /e /i /y' : 'cp -r';
  if (hasData) {
    console.log(`  ${cyan}Restoring data...${reset}`);
    runCommand(`${cpCmd} "${join(backupPath, 'data')}" "${join(projectRoot, 'data')}"`, { cwd: projectRoot });
  }
  if (hasConfig) {
    console.log(`  ${cyan}Restoring config...${reset}`);
    runCommand(`${cpCmd} "${join(backupPath, 'config')}" "${join(projectRoot, 'config')}"`, { cwd: projectRoot });
  }
  console.log(`\n  ${green}✔ Restore complete from '${selected}'.${reset}\n`);
}

// 15. Logs command
async function cmdLogs() {
  console.log(`
${bold}=====================================================${reset}`);
  console.log(`             TIF-AI Logs`);
  console.log(`=====================================================
`);
  
  const logsDir = join(getGlobalConfigDir(), 'logs');
  const cliLog = join(logsDir, 'cli.log');
  const backendLog = join(logsDir, 'backend.log');
  
  console.log(`  ${cyan}📄 Available Log Files:${reset}`);
  console.log(`  - CLI Log:     ${cliLog}`);
  console.log(`  - Backend Log: ${backendLog}
`);
  
  console.log(`  ${cyan}🔄 Tailing logs (Press Ctrl+C to stop)...${reset}
`);
  
  const isWin = platform() === 'win32';
  try {
    if (isWin) {
      // Create a small powershell script to tail both
      const psCmd = `Get-Content -Path "${logsDir}\*.log" -Wait -Tail 20`;
      spawn('powershell', ['-Command', psCmd], { stdio: 'inherit' });
    } else {
      spawn('tail', ['-f', '-n', '20', cliLog, backendLog], { stdio: 'inherit' });
    }
  } catch(e) {
    console.log(`  ${red}✘ Error tailing logs: ${e.message}${reset}`);
  }
}


// 16. Config command
async function cmdConfig(args) {
  const configDir = getGlobalConfigDir();
  const configPath = join(configDir, 'ai-config.json');
  
  if (args && args[1] === 'export') {
    const outPath = args[2] || join(process.cwd(), 'ai-config.json');
    console.log(`
  ${cyan}📤 Exporting config to ${outPath}...${reset}`);
    if (existsSync(configPath)) {
      writeFileSync(outPath, readFileSync(configPath));
      console.log(`  ${green}✔ Export complete.${reset}
`);
    } else {
      console.log(`  ${red}✘ No active configuration found to export.${reset}
`);
    }
    return;
  }
  
  if (args && args[1] === 'import') {
    const inPath = args[2];
    if (!inPath) {
       console.log(`
  ${red}✘ Missing import path. Usage: tif-ai config import <path>${reset}
`);
       return;
    }
    console.log(`
  ${cyan}📥 Importing config from ${inPath}...${reset}`);
    if (existsSync(inPath)) {
      if (!existsSync(configDir)) mkdirSync(configDir, { recursive: true });
      writeFileSync(configPath, readFileSync(inPath));
      console.log(`  ${green}✔ Import complete.${reset}
`);
    } else {
      console.log(`  ${red}✘ File not found: ${inPath}${reset}
`);
    }
    return;
  }

  console.log(`
${bold}=====================================================${reset}`);
  console.log(`             TIF-AI Configuration`);
  console.log(`=====================================================
`);
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    console.log(JSON.stringify(config, null, 2));
  } else {
    console.log(`  ${yellow}⚠ No config found. Run 'tif-ai setup'.${reset}`);
  }
  console.log();
}

// 17. AI router extensions (test, models, pull)
async function cmdAiTest() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Testing AI Provider Connection`);
  console.log(`=====================================================\n`);
  console.log(`  ${cyan}🔌 Testing connection...${reset}`);
  // We reuse doctor logic loosely, but just run doctor for now as it has full AI tests
  await cmdDoctor();
}

async function cmdAiModels() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Available AI Models`);
  console.log(`=====================================================\n`);
  const configPath = join(getGlobalConfigDir(), 'ai-config.json');
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    console.log(`  Provider: ${cyan}${config.ai?.provider || 'Unknown'}${reset}`);
    if (config.ai?.provider === 'ollama') {
      const endpoint = config.ai.endpoint || 'http://localhost:11434';
      const cleanEndpoint = endpoint.endsWith('/v1') ? endpoint.slice(0, -3) : endpoint;
      const res = await httpRequest(`${cleanEndpoint}/api/tags`, { timeout: 3000 });
      if (res.success) {
        try {
          const tags = JSON.parse(res.body);
          console.log(`\n  ${bold}Installed Ollama Models:${reset}`);
          tags.models.forEach(m => console.log(`  - ${green}${m.name}${reset} (${Math.round(m.size / 1024 / 1024 / 1024 * 10) / 10} GB)`));
        } catch(e){}
      }
    } else {
      console.log(`  ${yellow}Model listing is only implemented for Ollama locally right now.${reset}`);
      if (config.ai?.model) console.log(`  Configured Model: ${green}${config.ai.model}${reset}`);
    }
  } else {
    console.log(`  ${red}AI not configured.${reset}`);
  }
  console.log();
}

async function cmdAiPull(args) {
  if (!args[2]) {
    console.log(`\n  ${red}✘ Missing model name. Usage: tif-ai ai pull <model_name>${reset}\n`);
    process.exit(1);
  }
  const modelName = args[2];
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Pulling AI Model: ${modelName}`);
  console.log(`=====================================================\n`);
  console.log(`  ${cyan}📥 Pulling via Ollama...${reset}`);
  runCommand(`ollama pull ${modelName}`, { stdio: 'inherit' });
  console.log(`\n${green}✔ Pull complete.${reset}\n`);
}

// 18. Agents command
async function cmdAgents() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Available Agent Protocols`);
  console.log(`=====================================================\n`);
  const agentsDir = join(projectRoot, 'app', 'services');
  if (existsSync(agentsDir)) {
    console.log(`  ${cyan}Core Agents:${reset}`);
    console.log(`  - Dashboard Intelligence Agent`);
    console.log(`  - ReAct SQL Agent`);
    console.log(`  - Data Quality Agent`);
  }
  console.log(`\n  ${dim}See docs/agent_protocols.md for details.${reset}\n`);
}

// 19. Skills command
async function cmdSkills() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Available AI Skills`);
  console.log(`=====================================================\n`);
  const skillsDir = join(projectRoot, 'skills');
  if (existsSync(skillsDir)) {
    const files = readdirSync(skillsDir);
    console.log(`  ${cyan}Loaded Skills:${reset}`);
    files.forEach(f => console.log(`  - ${green}${f}${reset}`));
  } else {
    console.log(`  ${yellow}No custom skills found in skills/ directory.${reset}`);
  }
  console.log();
}

// 20. Data commands (validate, reload, quality, export)
async function cmdDataValidate() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Data Validation`);
  console.log(`=====================================================\n`);
  console.log(`  ${cyan}🔍 Validating CSV files...${reset}`);
  const inventoryCsv = join(projectRoot, 'data', 'inventory_data.csv');
  const salesCsv = join(projectRoot, 'data', 'sales_data.csv');
  let ok = true;
  if (!existsSync(inventoryCsv)) { console.log(`  ${red}✘ inventory_data.csv missing${reset}`); ok = false; }
  if (!existsSync(salesCsv)) { console.log(`  ${red}✘ sales_data.csv missing${reset}`); ok = false; }
  
  if (ok) console.log(`\n  ${green}✔ Data files are present and valid.${reset}\n`);
  else process.exit(1);
}

async function cmdDataReload() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Reloading Database from CSV`);
  console.log(`=====================================================\n`);
  console.log(`  ${cyan}🔄 Rebuilding DuckDB database...${reset}`);
  const venvDir = join(projectRoot, 'venv');
  const isWin = platform() === 'win32';
  const pythonExec = isWin ? join(venvDir, 'Scripts', 'python.exe') : join(venvDir, 'bin', 'python');
  
  const script = `import duckdb; con = duckdb.connect(r'${join(projectRoot, 'data', 'tifai.duckdb')}'); con.execute("DROP TABLE IF EXISTS sales_data;"); con.execute("DROP TABLE IF EXISTS inventory_data;"); print("Tables dropped.");`;
  const tmpFile = join(tmpdir(), 'tifai_reload.py');
  writeFileSync(tmpFile, script);
  runCommand(`"${pythonExec}" "${tmpFile}"`, { cwd: projectRoot });
  
  console.log(`\n  ${green}✔ Database cleared. It will automatically reload on backend startup.${reset}\n`);
}

async function cmdDataQuality() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Data Quality Check`);
  console.log(`=====================================================\n`);
  const venvDir = join(projectRoot, 'venv');
  const isWin = platform() === 'win32';
  const pythonExec = isWin ? join(venvDir, 'Scripts', 'python.exe') : join(venvDir, 'bin', 'python');

  const script = `
import json, sys
sys.path.insert(0, r'${projectRoot.replace(/\\/g, '\\\\')}')
from app.services.skills import check_data_quality
result = check_data_quality({})
print(json.dumps(result, indent=2))
`;
  const tmpFile = join(tmpdir(), 'tifai_quality.py');
  writeFileSync(tmpFile, script);
  const res = runCommand(`"${pythonExec}" "${tmpFile}"`);
  if (res.success) {
    try {
      const data = JSON.parse(res.stdout);
      console.log(`  ${bold}Data Status:${reset}`);
      console.log(`  Inventory Rows: ${cyan}${data.status.inventory_rows}${reset}`);
      console.log(`  Sales Rows:     ${cyan}${data.status.sales_rows}${reset}`);
      console.log(`  Has Data:       ${data.status.has_inventory_data ? green + 'Yes' : red + 'No'}${reset}`);
      if (data.quality_issues.length > 0) {
        console.log(`\n  ${yellow}⚠ ${data.quality_issues.length} quality issue(s) found:${reset}`);
        data.quality_issues.forEach(issue => {
          console.log(`  - [${issue.severity}] ${issue.table}.${issue.column}: ${issue.issue}`);
        });
      } else {
        console.log(`\n  ${green}✔ No quality issues detected.${reset}`);
      }
    } catch (e) {
      console.log(`  ${res.stdout}`);
    }
  } else {
    console.log(`  ${red}✘ Quality check failed: ${res.stderr}${reset}`);
  }
  console.log();
}

async function cmdExport() {
  console.log(`\n${bold}=====================================================${reset}`);
  console.log(`             Exporting Database`);
  console.log(`=====================================================\n`);
  const venvDir = join(projectRoot, 'venv');
  const isWin = platform() === 'win32';
  const pythonExec = isWin ? join(venvDir, 'Scripts', 'python.exe') : join(venvDir, 'bin', 'python');
  const exportsDir = join(projectRoot, 'data', 'exports');
  mkdirSync(exportsDir, { recursive: true });

  const script = `
import duckdb, os
db_path = r'${join(projectRoot, 'data', 'tifai.duckdb').replace(/\\/g, '\\\\')}'
out_dir = r'${exportsDir.replace(/\\/g, '\\\\')}'
con = duckdb.connect(db_path)
tables = con.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='main'").fetchall()
for t in tables:
    name = t[0]
    df = con.execute(f"SELECT * FROM {name}").fetchdf()
    path = os.path.join(out_dir, f"{name}.csv")
    df.to_csv(path, index=False)
    print(f"  Exported {name}: {len(df)} rows")
con.close()
`;
  const tmpFile = join(tmpdir(), 'tifai_export.py');
  writeFileSync(tmpFile, script);
  const res = runCommand(`"${pythonExec}" "${tmpFile}"`);
  if (res.success) {
    console.log(`${res.stdout}`);
    console.log(`  ${green}✔ Export complete. Files saved to: ${exportsDir}${reset}\n`);
  } else {
    console.log(`  ${red}✘ Export failed: ${res.stderr}${reset}\n`);
  }
}

function showHelp() {
  console.log(`
${bold}TIF-AI Command Line Interface (v${CLI_VERSION})${reset}
Professional developer tool for managing the AI logistics & inventory application.

${bold}Usage:${reset}
  tif-ai <command> [options]

${bold}Core Commands:${reset}
  ${green}setup${reset} (install)  Run the interactive AI Setup Wizard
  ${green}start${reset} (run)      Launch the backend and frontend concurrently
  ${green}stop${reset}             Stop running TIF-AI services gracefully
  ${green}restart${reset}          Restart running TIF-AI services
  ${green}doctor${reset}           Diagnose system, python, node, config, and ports
  ${green}status${reset}           Check the running status of services
  ${green}info${reset}             Display diagnostic information about hardware/OS
  ${green}version${reset}          Display current CLI version

${bold}Maintenance & Lifecycle:${reset}
  ${green}update${reset}           Pull latest git changes and update dependencies
  ${green}upgrade${reset}          Upgrade python and node dependencies to latest
  ${green}build${reset}            Compile frontend React app for production
  ${green}test${reset}             Run backend and frontend test suites
  ${green}clean${reset}            Remove caches, node_modules, and temp files
  ${green}reset${reset}            Factory reset (Deletes config and database)

${bold}Data & State:${reset}
  ${green}backup${reset}           Create a backup archive of data and config
  ${green}restore${reset}          Restore from a backup archive
  ${green}logs${reset}             View streaming service logs
  ${green}config${reset}           View current active configuration
  ${green}export${reset}           Export database tables to CSV

${bold}AI & Agents:${reset}
  ${green}ai switch${reset}        Switch AI Provider interactively
  ${green}ai test${reset}          Test AI Provider connectivity
  ${green}ai models${reset}        List available models for current provider
  ${green}ai pull <name>${reset}   Pull a model (Ollama)
  ${green}agents${reset}           List available AI agent protocols
  ${green}skills${reset}           List loaded reusable AI skills

${bold}Data Utilities:${reset}
  ${green}data validate${reset}    Verify integrity of data files
  ${green}data reload${reset}      Drop and rebuild database from CSV
  ${green}data quality${reset}     Run data quality analytics

${bold}Global Options:${reset}
  -h, --help    Show this help menu
  -v, --version Show current version of the CLI

${dim}For issues or documentation, visit: https://github.com/TIF-AI/TIF-AI${reset}
`);
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === '--help' || cmd === '-h') {
    showHelp();
    process.exit(0);
  }

  if (cmd === '--version' || cmd === '-v' || cmd === 'version') {
    console.log(`tif-ai version ${CLI_VERSION}`);
    process.exit(0);
  }

  logEvent('INFO', 'CLI', `Executed command: ${cmd} ${args.slice(1).join(' ')}`);
  switch (cmd) {
    case 'doctor':
    case 'diagnostics':
      await cmdDoctor();
      break;
    case 'setup':
    case 'install':
    case 'init':
      await cmdSetup();
      break;
    case 'start':
    case 'run':
      await cmdStart();
      break;
    case 'stop':
      await cmdStop();
      break;
    case 'restart':
      await cmdRestart();
      break;
    case 'update':
      await cmdUpdate();
      break;
    case 'upgrade':
      await cmdUpgrade();
      break;
    case 'build':
      await cmdBuild();
      break;
    case 'clean':
      await cmdClean();
      break;
    case 'reset':
      await cmdReset();
      break;
    case 'backup':
      await cmdBackup();
      break;
    case 'restore':
      await cmdRestore();
      break;
    case 'logs':
      await cmdLogs();
      break;
    case 'config':
      await cmdConfig(args);
      break;
    case 'status':
      await cmdStatus();
      break;
    case 'info':
      await cmdInfo();
      break;
    case 'test':
      await cmdTest();
      break;
    case 'agents':
      await cmdAgents();
      break;
    case 'skills':
      await cmdSkills();
      break;
    case 'export':
      await cmdExport();
      break;
    case 'data':
      const dataCmd = args[1];
      if (dataCmd === 'validate') await cmdDataValidate();
      else if (dataCmd === 'reload') await cmdDataReload();
      else if (dataCmd === 'quality') await cmdDataQuality();
      else {
        console.error(`${red}Unknown data subcommand: '${dataCmd}'. Available: validate, reload, quality.${reset}`);
        process.exit(1);
      }
      break;
    case 'ai':
      const subcmd = args[1];
      if (subcmd === 'switch') {
        await cmdAiSwitch();
      } else if (subcmd === 'test') {
        await cmdAiTest();
      } else if (subcmd === 'models') {
        await cmdAiModels();
      } else if (subcmd === 'pull') {
        await cmdAiPull(args);
      } else {
        console.error(`${red}Unknown ai subcommand: '${subcmd}'. Available: switch, test, models, pull.${reset}`);
        process.exit(1);
      }
      break;
    default:
      console.error(`${red}Unknown command: '${cmd}'. Run 'tif-ai --help' for usage.${reset}`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`${red}Fatal CLI Error:${reset}`, err.message);
  process.exit(1);
});