const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const vitePath = path.join(root, "node_modules", "vite");

if (!fs.existsSync(vitePath)) {
  console.log("Dependencies not found. Running npm install (with devDependencies)...");
  const hasLock = fs.existsSync(path.join(root, "package-lock.json"));
  const env = { ...process.env, NODE_ENV: "development" };
  const cmd = hasLock ? "npm ci --include=dev" : "npm install --include=dev";
  execSync(cmd, {
    cwd: root,
    stdio: "inherit",
    env,
  });
}

// Run build from project root so we use the same node_modules we (may have) just installed
const buildEnv = { ...process.env, NODE_ENV: "development" };
execSync("npx tsc -b && npx vite build", {
  cwd: root,
  stdio: "inherit",
  env: buildEnv,
});
