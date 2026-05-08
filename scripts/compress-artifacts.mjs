import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const outputDir = path.join(process.cwd(), "output");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function hasCommand(command) {
  try {
    execFileSync("which", [command], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

if (!existsSync(outputDir)) {
  console.log("No output/ directory found.");
  process.exit(0);
}

if (!hasCommand("magick")) {
  console.error("ImageMagick is required for artifact compression. Install `magick` and rerun.");
  process.exit(1);
}

const imageFiles = walk(outputDir).filter((filePath) => imageExtensions.has(path.extname(filePath).toLowerCase()));

if (imageFiles.length === 0) {
  console.log("No image artifacts found in output/.");
  process.exit(0);
}

for (const filePath of imageFiles) {
  const before = statSync(filePath).size;
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".png") {
    execFileSync("magick", [filePath, "-strip", "-define", "png:compression-level=9", filePath]);
  } else if (ext === ".jpg" || ext === ".jpeg") {
    execFileSync("magick", [filePath, "-strip", "-sampling-factor", "4:2:0", "-quality", "82", filePath]);
  } else if (ext === ".webp") {
    execFileSync("magick", [filePath, "-strip", "-quality", "82", filePath]);
  }

  const after = statSync(filePath).size;
  const saved = before - after;
  console.log(`${path.relative(process.cwd(), filePath)} ${before} -> ${after} bytes (${saved} saved)`);
}
