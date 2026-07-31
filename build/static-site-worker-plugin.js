import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

async function collectFiles(directory, root = directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === "server" || entry.name === ".openai") continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(path, root));
    } else {
      files.push({
        path: `/${relative(root, path).split(sep).join("/")}`,
        type: contentTypes[extname(entry.name).toLowerCase()] ?? "application/octet-stream",
        body: (await readFile(path)).toString("base64")
      });
    }
  }
  return files;
}

function inlineApplicationShell(files) {
  const fileMap = new Map(files.map((file) => [file.path, file]));
  const indexFile = fileMap.get("/index.html");
  let html = Buffer.from(indexFile.body, "base64").toString("utf8");

  html = html.replace(/<link[^>]+href="\.([^\"]+\.css)"[^>]*>/g, (_match, path) => {
    const css = Buffer.from(fileMap.get(path).body, "base64").toString("utf8");
    return `<style>${css}</style>`;
  });
  html = html.replace(/<script([^>]*)src="\.([^\"]+\.js)"([^>]*)><\/script>/g, (_match, before, path, after) => {
    let javascript = Buffer.from(fileMap.get(path).body, "base64").toString("utf8");
    for (const file of files.filter((candidate) => candidate.type.startsWith("image/"))) {
      javascript = javascript.replaceAll(`.${file.path}`, `data:${file.type};base64,${file.body}`);
    }
    return `<script${before}${after}>${javascript.replaceAll("</script", "<\\/script")}</script>`;
  });

  return {
    type: indexFile.type,
    body: Buffer.from(html).toString("base64")
  };
}

export function staticSiteWorker() {
  let root = process.cwd();

  return {
    name: "static-site-worker",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(root, "dist");
      const serverDirectory = resolve(outputDirectory, "server");
      const files = await collectFiles(outputDirectory);
      const assets = { "/index.html": inlineApplicationShell(files) };

      const worker = `const assets = ${JSON.stringify(assets)};
const decode = (value) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let asset = assets[url.pathname];
    if (!asset && request.method === "GET" && (request.headers.get("accept") ?? "").includes("text/html")) {
      asset = assets["/index.html"];
    }
    if (!asset || (request.method !== "GET" && request.method !== "HEAD")) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(request.method === "HEAD" ? null : decode(asset.body), {
      headers: {
        "content-type": asset.type,
        "cache-control": url.pathname === "/index.html" || url.pathname === "/" ? "no-cache" : "public, max-age=31536000, immutable"
      }
    });
  }
};
`;

      await mkdir(serverDirectory, { recursive: true });
      await writeFile(resolve(serverDirectory, "index.js"), worker);
    }
  };
}
