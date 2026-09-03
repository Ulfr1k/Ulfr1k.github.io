/* Zero-dependency static server for local preview.
   Usage: node server.js [--port 7100] [--host 127.0.0.1] */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
function argOf(name, fallback) {
  const i = args.indexOf("--" + name);
  if (i !== -1 && args[i + 1]) return args[i + 1];
  const eq = args.find((a) => a.startsWith("--" + name + "="));
  if (eq) return eq.split("=")[1];
  return fallback;
}
const PORT = Number(argOf("port", process.env.PORT || 7100));
const HOST = argOf("host", "127.0.0.1");
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".md": "text/markdown; charset=utf-8",
};

http
  .createServer((req, res) => {
    let urlPath;
    try {
      urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    } catch {
      res.writeHead(400).end("Bad request");
      return;
    }
    let file = path.normalize(path.join(ROOT, urlPath));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    if (urlPath.endsWith("/")) file = path.join(file, "index.html");

    fs.readFile(file, (err, data) => {
      if (err) {
        fs.readFile(path.join(ROOT, "404.html"), (e2, page) => {
          res.writeHead(404, { "Content-Type": MIME[".html"] });
          res.end(e2 ? "Not found" : page);
        });
        return;
      }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      res.end(data);
    });
  })
  .listen(PORT, HOST, () => {
    console.log(`Preview: http://${HOST}:${PORT}/`);
  });
