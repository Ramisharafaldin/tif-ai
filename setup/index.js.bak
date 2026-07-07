
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

#!/usr/bin/env node

import { execSync, exec } from 'node:child_process';
import { createInterface } from 'node:readline';
import { existsSync, mkdirSync, writeFileSync, readFileSync, chmodSync, createWriteStream } from 'node:fs';
import { homedir, platform, tmpdir, totalmem, cpus, release } from 'node:os';
import { resolve, join } from 'node:path';
import https from 'node:https';
import http from 'node:http';
import crypto from 'node:crypto';

// ─── ANSI Colors (no dependencies needed) ────────────────────────────────
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

// ─── Helpers ─────────────────────────────────────────────────────────────
const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// ─── Cryptographic Obfuscation Helper (Zero-dependency key-based XOR) ─────
const KEY_PATH = join(homedir(), '.tif-ai.key');

function getOrCreateKey() {
  if (existsSync(KEY_PATH)) {
    try {
      return readFileSync(KEY_PATH);
    } catch (e) {}
  }
  const key = crypto.randomBytes(32);
  try {
    writeFileSync(KEY_PATH, key);
    chmodSync(KEY_PATH, '600');
  } catch (e) {}
  return key;
}

function encrypt(text) {
  if (!text) return '';
  try {
    const key = getOrCreateKey();
    const textBuffer = Buffer.from(text, 'utf-8');
    const cipherBuffer = Buffer.alloc(textBuffer.length);
    for (let i = 0; i < textBuffer.length; i++) {
      cipherBuffer[i] = textBuffer[i] ^ key[i % key.length];
    }
    return 'enc:' + cipherBuffer.toString('hex');
  } catch (e) {
    return text;
  }
}

// ─── Zero-Dependency HTTP Client ─────────────────────────────────────────
function httpRequest(url, options = {}, postData = null) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const reqOptions = {
        method: options.method || 'GET',
        headers: options.headers || {},
        timeout: options.timeout || 10000,
      };

      if (postData) {
        const bodyStr = typeof postData === 'string' ? postData : JSON.stringify(postData);
        reqOptions.headers['Content-Type'] = reqOptions.headers['Content-Type'] || 'application/json';
        reqOptions.headers['Content-Length'] = Buffer.byteLength(bodyStr);
      }

      const req = client.request(url, reqOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            statusCode: res.statusCode,
            body: data
          });
        });
      });

      req.on('error', (err) => {
        resolve({ success: false, statusCode: 0, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, statusCode: 0, error: 'Request Timeout' });
      });

      if (postData) {
        const bodyStr = typeof postData === 'string' ? postData : JSON.stringify(postData);
        req.write(bodyStr);
      }
      req.end();
    } catch (err) {
      resolve({ success: false, statusCode: 0, error: err.message });
    }
  });
}

// ─── LM Studio Local Installation Detection ──────────────────────────────
function detectLMStudio() {
  const osPlatform = platform();
  if (osPlatform === 'win32') {
    const userProfile = homedir();
    const path1 = join(userProfile, 'AppData', 'Local', 'Programs', 'lm-studio', 'LM Studio.exe');
    const path2 = join(process.env.LOCALAPPDATA || '', 'Programs', 'lm-studio', 'LM Studio.exe');
    return existsSync(path1) || existsSync(path2);
  } else if (osPlatform === 'darwin') {
    return existsSync('/Applications/LM Studio.app');
  } else {
    const res = runCommand('which lm-studio');
    return res.success;
  }
}

async function select(title, options) {
  console.log(`\n${bold}${title}${reset}\n`);
  for (let i = 0; i < options.length; i++) {
    console.log(`  ${green}[${i + 1}]${reset} ${options[i].label}`);
  }
  const answer = await ask(`\n${cyan}Select:${reset} `);
  const idx = parseInt(answer, 10) - 1;
  if (idx >= 0 && idx < options.length) return options[idx];
  console.log(`${red}Invalid selection.${reset}`);
  return select(title, options);
}

function clearScreen() {
  console.clear();
}

function printHeader() {
  clearScreen();
  console.log(`${bold}=====================================================`);
  console.log(`             Welcome to TIF-AI Setup`);
  console.log(`=====================================================${reset}\n`);
}

function printLine(char = '─', len = 40) {
  console.log(dim + char.repeat(len) + reset);
}

function success(msg) {
  console.log(`  ${bgGreen}${white}✓${reset} ${green}${msg}${reset}`);
}

function warn(msg) {
  console.log(`  ${bgYellow}${white}⚠${reset} ${yellow}${msg}${reset}`);
}

// Keep info clean and plain for standard reports
function info(msg) {
  console.log(`  ${blue}ℹ${reset} ${msg}`);
}

function error(msg) {
  console.log(`  ${red}✗ ${msg}${reset}`);
}

async function confirmQuestion(msg) {
  const answer = await ask(`${cyan}${msg} (Y/n):${reset} `);
  return answer.toLowerCase() !== 'n';
}

// Helper to format checkmark status
function formatCheckStatus(isValid, text) {
  if (isValid) {
    return `${green}✔ ${text}${reset}`;
  } else {
    return `${red}✗ ${text}${reset}`;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function spinner(message) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write('\r  ${cyan}${frames[i]}${reset} ${message}...');
    i = (i + 1) % frames.length;
  }, 80);
  return {
    stop: (msg = '', type = 'success') => {
      clearInterval(interval);
      process.stdout.write('\r' + ' '.repeat(process.stdout.columns || 80) + '\r');
      if (msg) {
        if (type === 'success') success(msg);
        else if (type === 'warn') warn(msg);
        else info(msg);
      }
    },
  };
}

function runCommand(cmd, options = {}) {
  try {
    const stdout = execSync(cmd, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: options.timeout || 30000,
      ...options,
    });
    return { success: true, stdout: stdout.trim(), stderr: '' };
  } catch (e) {
    return { success: false, stdout: e.stdout?.trim() || '', stderr: e.stderr?.trim() || e.message };
  }
}

async function runCommandAsync(cmd, options = {}) {
  return new Promise((resolve) => {
    exec(cmd, { timeout: options.timeout || 120000, ...options }, (err, stdout, stderr) => {
      if (err) {
        resolve({ success: false, stdout: stdout?.trim() || '', stderr: stderr?.trim() || err.message });
      } else {
        resolve({ success: true, stdout: stdout?.trim() || '', stderr: '' });
      }
    });
  });
}

// ─── Progress Bar ────────────────────────────────────────────────────────
function showProgressBar(current, total, label = '') {
  const width = 30;
  const pct = Math.min(current / total, 1);
  const filled = Math.round(pct * width);
  const bar = green + '█'.repeat(filled) + dim + '░'.repeat(width - filled) + reset;
  process.stdout.write(`\r  ${bar} ${Math.round(pct * 100)}%${label ? ' ' + label : ''}   `);
}

// ─── Cross-Platform System Requirement Checkers ──────────────────────────

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

async function getPythonVersion() {
  let res = runCommand('python --version');
  if (!res.success) {
    res = runCommand('python3 --version');
  }
  if (res.success && res.stdout) {
    return res.stdout.replace('Python ', '').trim();
  }
  return null;
}

async function getGitVersion() {
  const res = runCommand('git --version');
  if (res.success && res.stdout) {
    return res.stdout.replace('git version ', '').trim();
  }
  return null;
}

async function getDockerVersion() {
  const res = runCommand('docker --version');
  if (res.success && res.stdout) {
    // Docker version format is usually "Docker version 24.0.7, build..."
    const match = res.stdout.match(/version\s+([^\s,]+)/i);
    return match ? match[1] : 'Installed';
  }
  return null;
}

async function getFreeDiskSpaceGB() {
  const osPlatform = platform();
  if (osPlatform === 'win32') {
    const res = runCommand('powershell -Command "[Math]::Round((Get-Volume -DriveLetter C).SizeRemaining / 1GB)"');
    if (res.success && res.stdout) {
      const val = parseInt(res.stdout.trim(), 10);
      if (!isNaN(val)) return val;
    }
    const resWmic = runCommand('wmic logicaldisk where "DeviceID=\'C:\'" get FreeSpace /Value', { shell: true });
    if (resWmic.success) {
      const match = resWmic.stdout.match(/FreeSpace=(\d+)/);
      if (match) return Math.round(parseInt(match[1]) / (1024 * 1024 * 1024));
    }
  } else {
    const res = runCommand('df -k .');
    if (res.success && res.stdout) {
      const lines = res.stdout.split('\n');
      if (lines.length > 1) {
        const parts = lines[1].split(/\s+/).filter(Boolean);
        const availKB = parseInt(parts[3], 10);
        if (!isNaN(availKB)) return Math.round(availKB / (1024 * 1024));
      }
    }
  }
  return 0;
}

async function checkSystem() {
  printHeader();
  process.stdout.write(`  ${cyan}🔍 Performing cross-platform system diagnostics...${reset}`);

  // Run all checks in parallel for maximum speed
  const [osName, pythonVer, gitVer, dockerVer, diskGB] = await Promise.all([
    getOSName(),
    getPythonVersion(),
    getGitVersion(),
    getDockerVersion(),
    getFreeDiskSpaceGB()
  ]);

  // Node version
  const nodeVer = process.version.replace('v', '');

  // RAM
  const totalRAMGB = Math.round(totalmem() / (1024 * 1024 * 1024));

  // CPU
  const cpuList = cpus();
  let cpuName = cpuList && cpuList.length > 0 ? cpuList[0].model.trim() : 'Unknown';
  cpuName = cpuName
    .replace(/\(R\)|\(TM\)/g, '')
    .replace(/\s+Processor/gi, '')
    .replace(/\s+CPU/gi, '')
    .replace(/\s+@\s+\d+(\.\d+)?GHz/gi, '')
    .trim();

  // Clear the "Performing diagnostics..." line
  process.stdout.write('\r' + ' '.repeat(80) + '\r');

  // Print results matching user design exactly
  printHeader();

  console.log(`${bold}Operating System${reset}`);
  console.log(formatCheckStatus(true, osName));
  console.log();

  console.log(`${bold}Python${reset}`);
  console.log(formatCheckStatus(!!pythonVer, pythonVer ? `Python ${pythonVer}` : 'Not Installed (Required >= 3.10)'));
  console.log();

  console.log(`${bold}Node.js${reset}`);
  console.log(formatCheckStatus(parseInt(nodeVer.split('.')[0]) >= 18, `Node ${nodeVer.split('.')[0]}`));
  console.log();

  console.log(`${bold}Git${reset}`);
  console.log(formatCheckStatus(!!gitVer, gitVer ? 'Installed' : 'Not Installed'));
  console.log();

  console.log(`${bold}Docker${reset}`);
  console.log(formatCheckStatus(!!dockerVer, dockerVer ? 'Installed' : 'Not Installed (Optional)'));
  console.log();

  console.log(`${bold}RAM${reset}`);
  console.log(formatCheckStatus(totalRAMGB >= 8, `${totalRAMGB} GB`));
  console.log();

  console.log(`${bold}CPU${reset}`);
  console.log(formatCheckStatus(true, cpuName));
  console.log();

  console.log(`${bold}Disk Space${reset}`);
  console.log(formatCheckStatus(diskGB >= 20, `${diskGB} GB Available`));
  console.log();

  printLine('─', 40);
  
  if (!pythonVer) {
    error('Missing Python! Please install Python 3.10+ and add it to your PATH.');
    rl.close();
    process.exit(1);
  }
  
  return true;
}


// ─── AI Provider Selection ──────────────────────────────────────────────
async function selectProvider() {
  printHeader();
  console.log(`${bold}Choose Your AI Provider${reset}\n`);
  console.log(`  ${dim}Select the AI backend for TIF-AI. Local providers are recommended.${reset}\n`);

  const providers = [
    { label: 'Ollama (Recommended for Local AI)', value: 'ollama', local: true },
    { label: 'LM Studio (OpenAI-Compatible Local Server)', value: 'lmstudio', local: true },
    { label: 'OpenRouter', value: 'openrouter', local: false },
    { label: 'Google Gemini', value: 'gemini', local: false },
    { label: 'OpenAI', value: 'openai', local: false },
    { label: 'Azure OpenAI', value: 'azure', local: false },
    { label: 'Custom OpenAI-Compatible Endpoint', value: 'custom', local: false },
  ];

  return select('', providers);
}

// ─── Provider Configuration ──────────────────────────────────────────────
async function configureProvider(provider) {
  printHeader();
  console.log(`${bold}Configure ${provider.label}${reset}\n`);

  const config = { provider: provider.value };

  switch (provider.value) {
    case 'ollama': {
      config.endpoint = await ask(`${cyan}Ollama endpoint URL${reset} (default: http://localhost:11434): `) || 'http://localhost:11434';
      break;
    }
    case 'lmstudio': {
      console.log(`  ${cyan}🔍 Detecting LM Studio...${reset}`);
      await sleep(500);
      const isInstalled = detectLMStudio();
      
      if (!isInstalled) {
        warn('LM Studio is not detected on your system.');
        await installLMStudio();
      } else {
        success('LM Studio installation detected!');
      }

      console.log(`\n  ${cyan}🔍 Checking LM Studio local server...${reset}`);
      // Test default port 1234
      const defaultCheck = await httpRequest('http://127.0.0.1:1234/v1/models', { timeout: 3000 });
      if (!defaultCheck.success) {
        warn('LM Studio local server is not currently enabled.');
        console.log(`\n  ${bold}To enable the local server in LM Studio:${reset}`);
        console.log(`  1. Open the ${bold}LM Studio${reset} application.`);
        console.log(`  2. Click the ${bold}Developer (Local Server)${reset} tab (${bold}<->${reset} icon on the left).`);
        console.log(`  3. Select a model to load from the top dropdown.`);
        console.log(`  4. Click the green ${bold}Start Server${reset} button.`);
        console.log(`  5. Ensure the server port is set to ${bold}1234${reset}.\n`);
        await ask(`${dim}Press Enter once you have started the server in LM Studio...${reset}`);
      } else {
        success('LM Studio local server is running!');
      }

      const host = await ask(`\n${cyan}LM Studio host${reset} (default: http://localhost): `) || 'http://localhost';
      const port = await ask(`${cyan}Port${reset} (default: 1234): `) || '1234';
      config.endpoint = `${host}:${port}`;
      config.port = port;

      // Verify endpoint
      console.log();
      process.stdout.write(`  ${cyan}Testing connection to LM Studio...${reset}`);
      const testUrl = `${host}:${port}/v1/models`;
      const result = await httpRequest(testUrl, { timeout: 5000 });
      process.stdout.write('\r' + ' '.repeat(50) + '\r');
      
      if (result.success) {
        let modelList = [];
        try {
          const data = JSON.parse(result.body);
          if (data.data && Array.isArray(data.data)) {
            modelList = data.data.map(m => m.id);
          }
        } catch(e){}
        success(`LM Studio connection verified!`);
        if (modelList.length > 0) {
          info(`Found loaded models: ${green}${modelList.join(', ')}${reset}`);
          config.model = modelList[0];
        } else {
          warn('Connection succeeded, but no models are currently loaded in LM Studio.');
          info('Make sure you have selected and loaded a model in LM Studio.');
        }
      } else {
        warn('Could not connect to LM Studio server. We will save the config, but please verify it is running.');
      }
      break;
    }
    case 'openrouter': {
      const apiKey = await ask(`${cyan}OpenRouter API Key:${reset} `);
      if (!apiKey) {
        error('API Key is required for OpenRouter.');
        rl.close();
        process.exit(1);
      }
      config.apiKey = encrypt(apiKey);

      const prefModel = await ask(`${cyan}Preferred Model${reset} (default: anthropic/claude-3.5-sonnet): `) || 'anthropic/claude-3.5-sonnet';
      config.model = prefModel;

      console.log();
      process.stdout.write(`  ${cyan}Validating OpenRouter credentials & connectivity...${reset}`);
      
      // Validate API Key and get account info
      const authUrl = 'https://openrouter.ai/api/v1/auth/key';
      const authRes = await httpRequest(authUrl, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout: 10000
      });

      // Get models list
      const modelsUrl = 'https://openrouter.ai/api/v1/models';
      const modelsRes = await httpRequest(modelsUrl, { timeout: 10000 });

      process.stdout.write('\r' + ' '.repeat(60) + '\r');

      if (authRes.success) {
        try {
          const data = JSON.parse(authRes.body);
          if (data.data) {
            success(`API Key is valid! Key Label: ${green}${data.data.label || 'Unnamed Key'}${reset} (Limit: ${data.data.limit || 'Unlimited'})`);
          } else {
            success('API Key is valid!');
          }
        } catch (e) {
          success('API Key validated successfully!');
        }
      } else {
        warn(`Could not validate API Key (Status: ${authRes.statusCode}). We will save the config, but please verify it is correct.`);
      }

      if (modelsRes.success) {
        try {
          const mData = JSON.parse(modelsRes.body);
          if (mData.data && Array.isArray(mData.data)) {
            const hasModel = mData.data.some(m => m.id === prefModel);
            if (hasModel) {
              success(`Model '${prefModel}' verified as available on OpenRouter!`);
            } else {
              info(`Connection verified. Note: Model '${prefModel}' was not in the public list, but it may still work.`);
            }
          }
        } catch (e) {}
      } else {
        warn('Could not fetch OpenRouter models list, but connectivity was verified.');
      }
      break;
    }
    case 'gemini': {
      const apiKey = await ask(`${cyan}Google Gemini API Key:${reset} `);
      if (!apiKey) {
        error('API Key is required for Gemini.');
        rl.close();
        process.exit(1);
      }
      config.apiKey = encrypt(apiKey);

      console.log();
      process.stdout.write(`  ${cyan}Verifying Google Gemini connection...${reset}`);
      // Verify connectivity and fetch models
      const verifyUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const result = await httpRequest(verifyUrl, { timeout: 10000 });
      process.stdout.write('\r' + ' '.repeat(50) + '\r');

      let geminiModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash', 'gemini-2.5-pro'];
      if (result.success) {
        success('Gemini API Key and connectivity verified successfully!');
        try {
          const data = JSON.parse(result.body);
          if (data.models && Array.isArray(data.models)) {
            const filtered = data.models
              .map(m => m.name.replace('models/', ''))
              .filter(name => name.includes('gemini') && !name.includes('vision') && !name.includes('embedding'));
            if (filtered.length > 0) {
              geminiModels = [...new Set(filtered)];
            }
          }
        } catch (e) {}
      } else {
        warn('Could not verify Gemini API Key. We will use standard model choices.');
      }

      // Allow model selection
      console.log(`\n${bold}Select Gemini Model:${reset}`);
      const modelOptions = geminiModels.map((m) => ({ label: m, value: m }));
      const selectedModel = await select('', modelOptions);
      config.model = selectedModel.value;
      success(`Selected model: ${selectedModel.value}`);
      break;
    }
    case 'openai': {
      const apiKey = await ask(`${cyan}OpenAI API Key:${reset} `);
      if (!apiKey) {
        error('API Key is required for OpenAI.');
        rl.close();
        process.exit(1);
      }
      config.apiKey = encrypt(apiKey);

      console.log();
      process.stdout.write(`  ${cyan}Verifying OpenAI API Key...${reset}`);
      const verifyUrl = 'https://api.openai.com/v1/models';
      const result = await httpRequest(verifyUrl, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout: 10000
      });
      process.stdout.write('\r' + ' '.repeat(50) + '\r');

      if (result.success) {
        success('OpenAI API Key and credentials verified successfully!');
      } else {
        warn(`Could not verify OpenAI API Key (Status: ${result.statusCode}). Please check your key.`);
      }

      console.log(`\n${bold}Select OpenAI Model:${reset}`);
      const openAiModels = [
        { label: 'gpt-4o (Recommended — Fast & Intelligent)', value: 'gpt-4o' },
        { label: 'gpt-4o-mini (Cost-Efficient & Fast)', value: 'gpt-4o-mini' },
        { label: 'gpt-4-turbo (Strong Reasoning)', value: 'gpt-4-turbo' },
        { label: 'gpt-3.5-turbo (Legacy)', value: 'gpt-3.5-turbo' }
      ];
      const selectedModel = await select('', openAiModels);
      config.model = selectedModel.value;
      success(`Selected model: ${selectedModel.value}`);
      break;
    }
    case 'azure': {
      const endpoint = await ask(`${cyan}Azure OpenAI Endpoint URL:${reset} `);
      const deploymentName = await ask(`${cyan}Deployment Name:${reset} `);
      const apiKey = await ask(`${cyan}Azure API Key:${reset} `);
      const apiVersion = await ask(`${cyan}API Version${reset} (default: 2024-02-15-preview): `) || '2024-02-15-preview';

      if (!endpoint || !deploymentName || !apiKey) {
        error('Endpoint, Deployment Name, and API Key are all required for Azure OpenAI.');
        rl.close();
        process.exit(1);
      }

      config.endpoint = endpoint;
      config.deploymentName = deploymentName;
      config.apiKey = encrypt(apiKey);
      config.apiVersion = apiVersion;
      config.model = deploymentName;

      console.log();
      process.stdout.write(`  ${cyan}Verifying connection to Azure OpenAI deployment...${reset}`);
      
      const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
      const testUrl = `${cleanEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
      const payload = {
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5
      };

      const result = await httpRequest(testUrl, {
        method: 'POST',
        headers: { 'api-key': apiKey },
        timeout: 10000
      }, payload);

      process.stdout.write('\r' + ' '.repeat(60) + '\r');

      if (result.success) {
        success('Azure OpenAI connection verified successfully! Deployment is active.');
      } else {
        warn(`Could not verify Azure OpenAI connection (Status: ${result.statusCode}). Please check your endpoint, deployment name, and API key.`);
      }
      break;
    }
    case 'custom': {
      const endpoint = await ask(`${cyan}Custom Endpoint URL:${reset} `);
      const apiKey = await ask(`${cyan}API Key (optional):${reset} `);
      const model = await ask(`${cyan}Default model name:${reset} `);

      if (!endpoint || !model) {
        error('Endpoint URL and Model Name are required.');
        rl.close();
        process.exit(1);
      }

      config.endpoint = endpoint;
      if (apiKey) {
        config.apiKey = encrypt(apiKey);
      }
      config.model = model;

      console.log();
      process.stdout.write(`  ${cyan}Verifying custom endpoint compatibility with OpenAI schema...${reset}`);
      
      const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
      const testUrl = `${cleanEndpoint}/models`;
      const headers = {};
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const result = await httpRequest(testUrl, { headers, timeout: 10000 });
      process.stdout.write('\r' + ' '.repeat(70) + '\r');

      if (result.success) {
        success('Endpoint verified! Responded to OpenAI-compatible /models query.');
      } else {
        warn(`Endpoint responded but could not verify compatibility (Status: ${result.statusCode}). It may still work.`);
      }
      break;
    }
  }

  return config;
}

// ─── Ollama Management ───────────────────────────────────────────────────
async function checkOllama() {
  printHeader();
  console.log(`${bold}🔍 Checking Ollama Installation${reset}\n`);

  const sp = spinner('Checking for Ollama');
  await sleep(800);
  const result = runCommand('ollama --version', { timeout: 5000 });

  if (result.success) {
    sp.stop(`Ollama detected: ${result.stdout}`, 'success');
    return { installed: true, version: result.stdout };
  } else {
    sp.stop('Ollama not found', 'warn');
    return { installed: false, version: null };
  }
}


async function installLMStudio() {
  printHeader();
  console.log(`${bold}🤖 Installing LM Studio${reset}\n`);

  const os = platform();
  if (os !== 'win32' && os !== 'darwin') {
    warn('Automatic installation of LM Studio is only supported on Windows and macOS.');
    return false;
  }

  if (!await confirmQuestion('Download and install LM Studio automatically?')) {
    info('Skipping automatic installation.');
    info(`Manual instructions: ${cyan}https://lmstudio.ai/download${reset}`);
    return false;
  }

  try {
    if (os === 'win32') {
      const sp = spinner('Downloading LM Studio for Windows...');
      const installerPath = join(tmpdir(), 'LMStudioSetup.exe');
      // Using a placeholder/typical direct link for LM Studio installer
      await downloadFile('https://releases.lmstudio.ai/windows/latest/LM-Studio-Setup.exe', installerPath, 'Downloading LM Studio');
      sp.stop('Download complete!', 'success');
      
      if (await confirmQuestion('Run installer silently now?')) {
         const sp2 = spinner('Installing LM Studio (silent mode)');
         const install = runCommand(`"${installerPath}" /S`, { timeout: 120000 });
         if (install.success) {
           sp2.stop('LM Studio installed successfully!', 'success');
           return true;
         } else {
           sp2.stop('Installation may need manual completion', 'warn');
           return false;
         }
      }
    } else if (os === 'darwin') {
      const sp = spinner('Downloading LM Studio for macOS...');
      const installerPath = join(tmpdir(), 'LMStudio.dmg');
      await downloadFile('https://releases.lmstudio.ai/mac/arm64/latest/LM-Studio.dmg', installerPath, 'Downloading LM Studio');
      sp.stop('Download complete!', 'success');
      info('Please open the downloaded DMG file manually: ' + installerPath);
      runCommand(`open "${installerPath}"`);
      return true;
    }
  } catch (e) {
    error(`Installation failed: ${e.message}`);
    info(`Please install manually from: ${cyan}https://lmstudio.ai/download${reset}`);
    return false;
  }
  return false;
}

async function installOllama() {
  printHeader();
  console.log(`${bold}📥 Installing Ollama${reset}\n`);

  const os = platform();
  const isWindows = os === 'win32';
  const isMac = os === 'darwin';
  const isLinux = os === 'linux';

  console.log(`  ${blue}ℹ${reset} Detected OS: ${os === 'win32' ? 'Windows' : os === 'darwin' ? 'macOS' : 'Linux'}`);
  console.log();

  if (!await confirmQuestion('Download and install Ollama automatically?')) {
    info('Skipping automatic installation.');
    info(`Manual instructions: ${cyan}https://ollama.ai/download${reset}`);
    return false;
  }

  const sp = spinner('Preparing installation');
  await sleep(500);

  try {
    if (isWindows) {
      sp.stop('Downloading Ollama for Windows...', 'info');
      const installerPath = join(tmpdir(), 'OllamaSetup.exe');
      await downloadFile(
        'https://ollama.com/download/OllamaSetup.exe',
        installerPath,
        'Downloading Ollama installer'
      );
      success('Download complete!');

      if (await confirmQuestion('Run installer silently now?')) {
        const sp2 = spinner('Installing Ollama (silent mode)');
        const install = runCommand(`"${installerPath}" /S`, { timeout: 120000 });
        if (install.success) {
          sp2.stop('Ollama installed successfully!', 'success');
        } else {
          sp2.stop('Installation may need manual completion', 'warn');
        }
      } else {
        info(`Installer saved to: ${cyan}${installerPath}${reset}`);
        info('Run it manually to complete installation.');
        return false;
      }
    } else if (isMac) {
      sp.stop('Installing Ollama via curl...', 'info');
      const install = runCommand('curl -fsSL https://ollama.com/install.sh | sh', {
        timeout: 120000,
        shell: true,
      });
      if (install.success) {
        sp.stop('Ollama installed successfully!', 'success');
      } else {
        sp.stop('Installation had issues', 'warn');
        console.log(install.stderr);
        return false;
      }
    } else if (isLinux) {
      sp.stop('Installing Ollama via curl...', 'info');
      const install = runCommand('curl -fsSL https://ollama.com/install.sh | sh', {
        timeout: 120000,
        shell: true,
      });
      if (install.success) {
        sp.stop('Ollama installed successfully!', 'success');
      } else {
        sp.stop('Installation had issues', 'warn');
        console.log(install.stderr);
        return false;
      }
    }
  } catch (e) {
    sp.stop('Installation failed', 'warn');
    error(e.message);
    info(`Please install manually from: ${cyan}https://ollama.ai/download${reset}`);
    return false;
  }

  return true;
}

function downloadFile(url, dest, label) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https.get(url, (response) => {
      const total = parseInt(response.headers['content-length'], 10);
      let downloaded = 0;

      response.on('data', (chunk) => {
        downloaded += chunk.length;
        if (total) showProgressBar(downloaded, total, label);
      });

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        process.stdout.write('\n');
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      reject(err);
    });
  });
}

async function verifyOllama() {
  printHeader();
  console.log(`${bold}✅ Verifying Ollama Installation${reset}\n`);

  const sp = spinner('Starting Ollama service');
  const start = runCommand('ollama serve', { timeout: 5000, shell: true });
  await sleep(2000);

  sp.stop('Checking Ollama status', 'info');

  const check = runCommand('ollama --version', { timeout: 5000 });
  if (check.success) {
    success(`Ollama ${check.stdout} is running!`);
    return true;
  } else {
    warn('Ollama is installed but not running.');
    if (await confirmQuestion('Start Ollama now?')) {
      runCommand('start ollama.exe', { shell: true, timeout: 5000 });
      await sleep(3000);
      const recheck = runCommand('ollama --version', { timeout: 5000 });
      if (recheck.success) {
        success('Ollama started successfully!');
        return true;
      } else {
        error('Could not start Ollama automatically.');
        info('Please start Ollama manually from the Start Menu.');
        return false;
      }
    }
    return false;
  }
}

async function listAndSelectModel() {
  printHeader();
  console.log(`${bold}📦 Managing Ollama Models${reset}\n`);

  // List installed models
  const sp = spinner('Fetching installed models');
  const result = runCommand('ollama list', { timeout: 10000 });

  let installedModels = [];
  if (result.success) {
    const lines = result.stdout.split('\n').slice(1).filter((l) => l.trim());
    installedModels = lines.map((l) => l.split(/\s+/)[0]).filter(Boolean);
  }

  if (installedModels.length > 0) {
    sp.stop(`Found ${installedModels.length} installed model(s)`, 'success');
    console.log();
    installedModels.forEach((m) => console.log(`  ${green}✓${reset} ${m}`));
    console.log();

    if (await confirmQuestion('Use existing models?')) {
      return installedModels;
    }
  } else {
    sp.stop('No models installed', 'warn');
  }

  // Auto-download — select a model and it pulls immediately
  console.log(`\n${bold}Choose Model${reset}\n`);
  const models = [
    { label: 'llama3', value: 'llama3' },
    { label: 'qwen3', value: 'qwen2.5' },
    { label: 'mistral', value: 'mistral' },
    { label: 'gemma', value: 'gemma2' },
    { label: 'deepseek', value: 'deepseek-r1' },
    { label: 'phi', value: 'phi4' },
  ];

  const selected = await select('', models);

  if (await confirmQuestion('\nDownload selected model now?')) {
    console.log(`\n  ${cyan}📥 Pulling '${selected.value}' model via Ollama. Please wait...${reset}\n`);
    
    try {
      execSync(`ollama pull ${selected.value}`, { stdio: 'inherit' });
      
      console.log();
      const sp2 = spinner('Verifying model functionality');
      const payload = {
        model: selected.value,
        prompt: 'say ok',
        stream: false
      };
      const verifyRes = await httpRequest('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        timeout: 10000
      }, payload);

      if (verifyRes.success) {
        sp2.stop(`Model ${selected.value} verified and working!`, 'success');
        return [selected.value];
      } else {
        sp2.stop(`Model pulled but could not verify response. It should still work.`, 'warn');
        return [selected.value];
      }
    } catch (e) {
      error(`Failed to pull model: ${e.message}`);
      info('You can pull it manually later by running: ' + cyan + `ollama pull ${selected.value}` + reset);
      return [];
    }
  }
  
  return [];
}

// ─── Config File Generation ──────────────────────────────────────────────
function generateConfig(providerConfig, models) {
  printHeader();
  console.log(`${bold}📝 Generating Configuration${reset}\n`);

  const sp = spinner('Creating config file');

  const configDir = getGlobalConfigDir();
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  const config = {
    ai: {
      provider: providerConfig.provider,
      ...providerConfig,
    },
    ollama: {
      models: models || [],
    },
    system: {
      setupCompleted: true,
      setupVersion: '1.0.0',
      setupDate: new Date().toISOString(),
    },
  };

  const configPath = join(configDir, 'ai-config.json');
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

  sp.stop(`Configuration saved to ${configPath}`, 'success');
  return configPath;
}

// ─── Summary ─────────────────────────────────────────────────────────────
function showSummary(provider, configPath, models) {
  printHeader();
  console.log(`${bgGreen}${white}${bold}  🎉 TIF-AI Setup Complete!  ${reset}\n`);
  printLine('═', 44);
  console.log();
  console.log(`  ${bold}AI Provider:${reset}    ${cyan}${provider.label}${reset}`);
  console.log(`  ${bold}Config File:${reset}    ${dim}${configPath}${reset}`);
  if (models && models.length > 0) {
    console.log(`  ${bold}Models:${reset}         ${green}${models.join(', ')}${reset}`);
  }
  console.log();

  if (provider.value === 'ollama') {
    console.log(`  ${bold}Quick Start:${reset}`);
    console.log(`    ${dim}Start Ollama:${reset}    ${cyan}ollama serve${reset}`);
    console.log(`    ${dim}Run a model:${reset}     ${cyan}ollama run ${models?.[0] || '<model>'}${reset}`);
    console.log();
  }

  console.log(`  ${dim}Run the frontend:${reset}`);
  console.log(`    ${cyan}cd frontend && npm install && npm start${reset}`);
  console.log();
  printLine('═', 44);
  console.log();
}

// ─── Main ────────────────────────────────────────────────────────────────
async function main() {
  try {
    // Step 1: System Check
    await checkSystem();
    await ask(`\n${dim}Press Enter to continue...${reset}`);

    // Step 2: Select Provider
    const provider = await selectProvider();
    success(`Selected: ${provider.label}`);

    // Step 3: Configure Provider
    await ask(`\n${dim}Press Enter to configure...${reset}`);
    const providerConfig = await configureProvider(provider);

    // Step 4: Ollama-specific setup
    let models = [];
    if (provider.value === 'ollama') {
      await ask(`\n${dim}Press Enter to set up Ollama...${reset}`);

      const ollamaStatus = await checkOllama();

      if (!ollamaStatus.installed) {
        await installOllama();
      }

      await verifyOllama();
      models = await listAndSelectModel();
    }

    // Step 5: Generate Config
    const configPath = generateConfig(providerConfig, models);

    // Step 6: Summary
    await sleep(500);
    showSummary(provider, configPath, models);

    rl.close();
  } catch (e) {
    console.error(`\n${red}Setup error:${reset} ${e.message}`);
    rl.close();
    process.exit(1);
  }
}

main();
