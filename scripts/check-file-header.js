/**
 * author: claude
 * create time: 2026-03-11 10:00:00
 * last edit time: 2026-03-11 10:05:00
 * description: lint-staged 钩子脚本，检查源码文件顶部是否包含规范的文件头注释，支持传入文件或目录
 */

// @ts-check

const fs = require("node:fs");
const path = require("node:path");

const HEADER_PATTERN =
  /^\/\*\*\s*\n\s*\*\s*author:\s*.+\n\s*\*\s*create time:\s*\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s*\n\s*\*\s*last edit time:\s*\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s*\n\s*\*\s*description:\s*.+\n\s*\*\//;

const SOURCE_EXTENSIONS = new Set([".js", ".ts", ".jsx", ".tsx"]);

/** Directories excluded from header check */
const EXCLUDED_DIRS = ["shared/components/ui", "node_modules"];

/**
 * Recursively collect source files from a directory.
 * @param {string} dir
 * @param {string[]} result
 * @returns {string[]}
 */
function collectFiles(dir, result = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, result);
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      result.push(full);
    }
  }
  return result;
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(
    "Usage: node scripts/check-file-header.js <file|dir> [file|dir] ...",
  );
  process.exit(1);
}

// Resolve args: expand directories into file lists
const files = [];
for (const arg of args) {
  if (!fs.existsSync(arg)) continue;
  if (fs.statSync(arg).isDirectory()) {
    collectFiles(arg, files);
  } else {
    files.push(arg);
  }
}

const errors = [];

for (const file of files) {
  const rel = path.relative(process.cwd(), file);

  // Skip excluded directories
  if (EXCLUDED_DIRS.some((dir) => rel.includes(dir))) continue;

  // Skip non-source files
  if (!SOURCE_EXTENSIONS.has(path.extname(file))) continue;

  const content = fs.readFileSync(file, "utf8");
  if (!HEADER_PATTERN.test(content)) {
    errors.push(rel);
  }
}

if (errors.length > 0) {
  console.error(
    `\n❌ Missing or malformed file header in ${errors.length} file(s):\n`,
  );
  for (const f of errors) {
    console.error(`   ${f}`);
  }
  console.error(
    "\nExpected format:\n" +
      "/**\n" +
      " * author: <name>\n" +
      " * create time: YYYY-MM-DD HH:mm:ss\n" +
      " * last edit time: YYYY-MM-DD HH:mm:ss\n" +
      " * description: <brief description>\n" +
      " */\n",
  );
  process.exit(1);
} else if (files.length > 0) {
  console.log(`✅ All ${files.length} file(s) have valid headers.`);
}
