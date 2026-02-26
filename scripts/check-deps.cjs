const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const vitePath = path.join(root, "node_modules", "vite");

if (!fs.existsSync(vitePath)) {
  console.log("Dependencies not found. Running npm install...");
  const hasLock = fs.existsSync(path.join(root, "package-lock.json"));
  execSync(hasLock ? "npm ci" : "npm install", {
    cwd: root,
    stdio: "inherit",
  });
}
