const fs = require("fs");
const path = require("path");

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".js")) {
      const content = fs.readFileSync(full, "utf8");
      if (content.includes("import.meta.url")) {
        const patched = content.replace(
          /globalThis\['__dirname'\]\s*=\s*[^;]*import\.meta\.url[^;]*;?/g,
          "",
        );
        if (patched !== content) {
          fs.writeFileSync(full, patched);
          console.log("[patch-prisma-esm] patched:", full);
        }
      }
    }
  }
}

walk(path.join(__dirname, "..", "generated", "prisma"));
