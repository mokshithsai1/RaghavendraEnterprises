import { transform } from "sucrase";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SKIP_FILES = new Set([
  path.normalize("frontend/src/pages/admin/scanner.tsx"),
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (/\.tsx?$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function convertFile(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, "/");
  if (SKIP_FILES.has(rel)) {
    fs.unlinkSync(filePath);
    console.log(`DELETED ${rel}`);
    return;
  }

  const code = fs.readFileSync(filePath, "utf8");
  const isTsx = filePath.endsWith(".tsx");
  const result = transform(code, {
    transforms: isTsx ? ["typescript", "jsx"] : ["typescript"],
    production: true,
    jsxRuntime: "automatic",
  });

  const newPath = filePath.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js");
  fs.writeFileSync(newPath, result.code);
  fs.unlinkSync(filePath);
  console.log(`${rel} -> ${path.relative(root, newPath).replace(/\\/g, "/")}`);
}

const dirs = [
  path.join(root, "frontend", "src"),
  path.join(root, "lib", "api-client-react"),
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir)) {
    convertFile(file);
  }
}

// Convert vite.config.ts
const viteConfig = path.join(root, "frontend", "vite.config.ts");
if (fs.existsSync(viteConfig)) {
  const code = fs.readFileSync(viteConfig, "utf8");
  const result = transform(code, { transforms: ["typescript"], production: true });
  const jsConfig = code
    .replace(/index\.ts/g, "index.js")
    .replace(/vite\.config\.ts/g, "vite.config.js");
  const converted = transform(jsConfig, { transforms: ["typescript"], production: true });
  fs.writeFileSync(path.join(root, "frontend", "vite.config.js"), converted.code);
  fs.unlinkSync(viteConfig);
  console.log("frontend/vite.config.ts -> frontend/vite.config.js");
}
