import { join } from "https://deno.land/std@0.203.0/path/mod.ts";

const filesToCopy = ["index.html", "main.js", "style.css", "Images"];

async function copyRecursive(src: string, dest: string) {
  const stat = await Deno.lstat(src);
  if (stat.isDirectory) {
    await Deno.mkdir(dest, { recursive: true });
    for await (const entry of Deno.readDir(src)) {
      await copyRecursive(join(src, entry.name), join(dest, entry.name));
    }
  } else {
    await Deno.copyFile(src, dest);
  }
}

async function main() {
  const cwd = Deno.cwd();
  const out = join(cwd, "dist");

  try {
    await Deno.remove(out, { recursive: true });
  } catch (_) {}

  await Deno.mkdir(out, { recursive: true });

  for (const name of filesToCopy) {
    try {
      const src = join(cwd, name);
      const dst = join(out, name);
      await copyRecursive(src, dst);
      console.log(`Copied ${name}`);
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        console.log(`Skipping ${name} (not found)`);
      } else {
        throw err;
      }
    }
  }

  console.log("Build complete. Output in ./dist");
}

if (import.meta.main) await main();
