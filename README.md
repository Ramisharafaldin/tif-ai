# TIF-AI — Professional AI-Native Platform

TIF-AI (Tactical Intelligence Framework) is an enterprise-grade, AI-native platform designed for intelligent inventory management, logistics demand forecasting, and stock transfer recommendations. It combines a robust FastAPI Python backend, a highly responsive React frontend, and a powerful, globally accessible Command-Line Interface (CLI).

---

## 🚀 Installation & Quick Start

Transform TIF-AI into a globally available developer tool (similar to Docker, Flutter, or Poetry).

### 1. Global CLI Installation
Navigate to the `cli` directory, install dependencies, and link the executable globally. This works natively on **Windows, macOS, and Linux**.

```bash
cd cli
npm install
npm run build
npm link    # Or depending on your OS: npm install -g .
```

### 2. First Run & Setup
Initialize your environment, perform system checks, and configure your AI model interactively:

```bash
tif-ai setup
```
*(You can also use `tif-ai install` or `tif-ai init`)*

### 3. Launching the Platform
Start the frontend and backend concurrently. The CLI handles ports, merges color-coded logs, and automatically launches your browser:
```bash
tif-ai start
```
To stop the services safely, simply use `Ctrl+C`, or run `tif-ai stop` in another terminal.

---

## 💻 Comprehensive CLI Usage

The `tif-ai` CLI provides complete control over your environment, data, and configurations.

### Core Commands
- `tif-ai setup` : Run the interactive AI Setup Wizard.
- `tif-ai start` : Launch backend and frontend concurrently.
- `tif-ai stop` : Safely kill running TIF-AI services (frees ports 8000 & 3000).
- `tif-ai restart` : Restart running TIF-AI services.
- `tif-ai doctor` : Perform a 17-point deep diagnostic check on system health.
- `tif-ai status` : Check the running status of services and AI configuration.
- `tif-ai logs` : Dynamically tail system logs (`cli.log` & `backend.log`) in real-time.

### Data & State Management
- `tif-ai data validate` : Verify the structural integrity of your source CSV data.
- `tif-ai data reload` : Rebuild the internal DuckDB database from your CSV files.
- `tif-ai data quality` : Run anomaly detection on your current dataset.
- `tif-ai export` : Export internal DuckDB tables back into raw CSVs.

### Maintenance
- `tif-ai build` : Compile the React frontend for production distribution.
- `tif-ai clean` : Remove `node_modules`, Python `__pycache__`, and temporary build files.
- `tif-ai reset` : **Factory Reset**. Deletes internal database and resets AI configurations.

---

## 🤖 AI Provider Setup & Management

TIF-AI completely abstracts the AI layer, allowing you to seamlessly switch between local, privacy-first models and cloud providers.

### Switching AI Providers
You can change your AI provider at any time without reinstalling the platform:
```bash
tif-ai ai switch
```
**Supported Providers:**
1. **Ollama** (Recommended for local/offline AI)
2. **LM Studio** (OpenAI-compatible local servers)
3. **OpenRouter**
4. **Google Gemini**
5. **OpenAI**
6. **Azure OpenAI**
7. **Custom OpenAI-Compatible Endpoints**

### AI Utilities
- `tif-ai ai test` : Ping your configured AI provider to verify connectivity and API keys.
- `tif-ai ai models` : List available models on your current provider (e.g., dynamically fetches local Ollama models).
- `tif-ai ai pull <model_name>` : Tell your local provider (e.g., Ollama) to download a specific model.
- `tif-ai agents` : List available autonomous AI agent protocols.
- `tif-ai skills` : List loaded atomic, reusable AI skills.

---

## ⚙️ Configuration Management

For maximum security and to avoid accidentally committing sensitive API keys, **TIF-AI never stores configuration inside the repository**. All configs and encryption keys are stored globally.

**Global Storage Paths by OS:**
- **Windows**: `%APPDATA%\TIF-AI\`
- **macOS**: `~/Library/Application Support/TIF-AI/`
- **Linux**: `~/.config/tif-ai/`

### Viewing Configuration
To view your currently active configuration safely:
```bash
tif-ai config
```

### Exporting and Importing (Restoring) Configuration
If you need to move to a new machine or share safe configurations:
```bash
# Export config to a specific path
tif-ai config export C:\backups\my-ai-config.json

# Restore/Import configuration from a file
tif-ai config import C:\backups\my-ai-config.json
```

---

## 🔄 Updating TIF-AI (Auto-Update)

TIF-AI includes an intelligent, safe auto-updater. 

```bash
tif-ai update
```
**How it works:**
1. Checks the GitHub API (or git origin) for the latest release.
2. Prompts you interactively if a new version is detected.
3. Automatically triggers `tif-ai backup` to secure your current state.
4. Executes `git pull`, `npm install`, and `pip install` transparently.
5. **Auto-Rollback**: If any dependency fails to install or a git conflict occurs, it instantly rolls back to the previous safe Git Hash (`git reset --hard`) and restores your data.

> To forcefully upgrade all backend and frontend dependencies to their latest compatible versions, use `tif-ai upgrade`.

---

## 💾 Backup Procedures

TIF-AI makes it incredibly easy to snapshot your environment.

```bash
tif-ai backup
```
This command instantly creates a timestamped archive containing:
- The DuckDB database.
- Data source files.
- Active AI configurations.

To restore a backup, you can either manually replace the `data` folder from your backup, or (soon) use `tif-ai restore` for automated restoration.

---

## 🛠️ Troubleshooting

If TIF-AI behaves unexpectedly, follow this escalation path:

1. **Check System Health:**
   Run `tif-ai doctor`. Look for any Red ✘ marks indicating missing python versions, port conflicts, or missing `.env` files.
2. **Verify AI Connection:**
   Run `tif-ai ai test` to ensure your API keys or local LLM server (e.g., Ollama on port 11434) are active.
3. **Stream Logs:**
   Run `tif-ai logs` in a separate terminal. This will tail both `cli.log` and `backend.log` in real-time. Execute your action and watch the logs for detailed python stack traces or setup errors.
4. **Kill Orphaned Processes:**
   If the app fails to start because ports 8000 or 3000 are in use, run `tif-ai stop` to force-kill rogue Node or Python instances.
5. **Nuclear Option (Factory Reset):**
   If data gets corrupted, run `tif-ai reset`, followed by `tif-ai setup` to rebuild your environment from scratch.

---

## 📄 License

MIT
# tif-ai
