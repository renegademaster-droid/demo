const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const nodeModules = path.join(root, "node_modules");
const vitePath = path.join(nodeModules, "vite");
const reactPath = path.join(nodeModules, "react");
const tscPath = path.join(nodeModules, ".bin", "tsc");
const reactRouterPath = path.join(nodeModules, "react-router-dom");

const env = { ...process.env, NODE_ENV: "development" };

function needInstall() {
  return (
    !fs.existsSync(vitePath) ||
    !fs.existsSync(reactPath) ||
    !fs.existsSync(tscPath) ||
    !fs.existsSync(reactRouterPath)
  );
}

if (needInstall()) {
  console.log("Dependencies missing or incomplete. Running full npm install...");
  if (fs.existsSync(nodeModules)) {
    try {
      fs.rmSync(nodeModules, { recursive: true });
    } catch (_) {}
  }
  const hasLock = fs.existsSync(path.join(root, "package-lock.json"));
  execSync(hasLock ? "npm ci --include=dev" : "npm install --include=dev", {
    cwd: root,
    stdio: "inherit",
    env,
  });
}

if (needInstall()) {
  console.log("Second attempt: npm install --include=dev");
  execSync("npm install --include=dev", { cwd: root, stdio: "inherit", env });
}

// CI often installs prod-only or incomplete; force-install all deps by name
if (needInstall()) {
  console.log("Force-installing all dependencies by name (CI workaround)...");
  execSync(
    "npm install @chakra-ui/react @emotion/react @gdesignsystem/icons @gdesignsystem/react next-themes pdfjs-dist react react-dom react-router-dom",
    { cwd: root, stdio: "inherit", env }
  );
  execSync(
    "npm install typescript vite @vitejs/plugin-react @types/node @types/react @types/react-dom --save-dev",
    { cwd: root, stdio: "inherit", env }
  );
}

// Run via npm so PATH and pnpm symlinks work (direct execSync of .bin/tsc can hang)
execSync("npm run build:tsc", { cwd: root, stdio: "inherit", env });
execSync("npm run build:vite", { cwd: root, stdio: "inherit", env });
