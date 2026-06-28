// TIF-AI CLI Post-installation script
import { platform } from 'node:os';

const reset = '\x1b[0m';
const bold = '\x1b[1m';
const green = '\x1b[32m';
const cyan = '\x1b[36m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';

console.log(`\n${bold}=====================================================${reset}`);
console.log(`${green}${bold}         🎉 TIF-AI CLI Installed Successfully!${reset}`);
console.log(`${bold}=====================================================${reset}\n`);

console.log(`  ${bold}To make the global 'tif-ai' command available, run:${reset}`);
console.log(`  ${cyan}npm install -g .${reset}   (or ${cyan}npm link${reset}) inside the ${dim}cli/${reset} directory.\n`);

console.log(`  ${bold}Once linked, you can run these commands from anywhere:${reset}`);
console.log(`    ${green}tif-ai doctor${reset}    - Diagnose your developer environment`);
console.log(`    ${green}tif-ai setup${reset}     - Run the interactive AI Setup Wizard`);
console.log(`    ${green}tif-ai start${reset}     - Start the full stack (backend + frontend)`);
console.log(`    ${green}tif-ai status${reset}    - Check the running services status`);
console.log(`    ${green}tif-ai test${reset}      - Run unit and integration tests`);
console.log(`    ${green}tif-ai info${reset}      - Show system and path information\n`);

console.log(`${dim}Thank you for choosing TIF-AI — The Native AI Logistics & Inventory Tool.${reset}\n`);
