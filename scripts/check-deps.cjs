const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const vitePath = path.join(root, "node_modules", "vite");
const tscPath = path.join(root, "node_modules", ".bin", "tsc");

const env = { ...process.env, NODE_ENV: "development" };

if (!fs.existsSync(vitePath)) {
  console.log("Dependencies not found. Running npm install (with devDependencies)...");
  const hasLock = fs.existsSync(path.join(root, "package-lock.json"));
  execSync(hasLock ? "npm ci --include=dev" : "npm install --include=dev", {
    cwd: root,
    stdio: "inherit",
    env,
  });
}

if (!fs.existsSync(vitePath) || !fs.existsSync(tscPath)) {
  console.log("Installing build devDependencies explicitly...");
  execSync(
    "npm install typescript vite @vitejs/plugin-react @types/node --save-dev",
    { cwd: root, stdio: "inherit", env }
  );
}

// Run via npm so PATH and pnpm symlinks work (direct execSync of .bin/tsc can hang)
execSync("npm run build:tsc", { cwd: root, stdio: "inherit", env });
execSync("npm run build:vite", { cwd: root, stdio: "inherit", env });
