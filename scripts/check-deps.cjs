const fs = require("fs");
const path = require("path");
const vitePath = path.join(__dirname, "..", "node_modules", "vite");
if (!fs.existsSync(vitePath)) {
  console.error("\nError: Dependencies not installed. Run: npm install\n");
  process.exit(1);
}
