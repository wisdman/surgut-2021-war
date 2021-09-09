const { parentPort, workerData } = require("worker_threads")

const { createServer } = require("https")

const path = require("path")

const { createReadStream, promises:fs } = require("fs")

const APP_SUFFIX = "/app"
const CONTENT_SUFFIX = "/content"
const INDEX_FILE = "index.html"

const ID_PATH = path.resolve(__dirname, `./id.txt`)

const APP_PATH = path.resolve(__dirname, `.${APP_SUFFIX}`)
const APP_INDEX =  path.join(APP_PATH, INDEX_FILE)

const CONTENT_DIR = path.resolve(__dirname, `.${CONTENT_SUFFIX}`)
const CONTENT_RX = new RegExp(`^${CONTENT_SUFFIX}(?<postfix>.*)`)

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".glsl": "text/plain",
}

const MIME_DEFAULT = "application/octet-stream"

const HEADERS = {
  "Cache-Control": "no-cache, must-revalidate, max-age=0",
}

async function staticServe(suffix, base) {
  const filePath = path.join(base, suffix)
  const stat = await fs.stat(filePath)
  if (stat.isDirectory()) {
    const indexSuffix = path.join(suffix, INDEX_FILE)
    return staticServe(indexSuffix, base)
  }

  const ext = path.extname(filePath)
  const mime = MIME[ext] ?? MIME_DEFAULT
  return [createReadStream(filePath), mime]
}

function router(request, response) {
  let suffix = path.normalize(request.url)

  if (request.url === "/id") {
    const fileStream = createReadStream(ID_PATH)
    response.writeHead(200, {...HEADERS, "Content-Type": "text/plain"})
    fileStream.pipe(response)
    return
  }

  // Content serve
  const contentMatch = CONTENT_RX.exec(request.url)
  if (contentMatch) {
    suffix = contentMatch.groups.postfix
    staticServe(suffix, CONTENT_DIR).then(([fileStream, mime]) => {
      response.writeHead(200, {...HEADERS, "Content-Type": mime })
      fileStream.pipe(response)
    }).catch(error => {
      if (error.code === "ENOENT") {
        response.writeHead(404, {...HEADERS, "Content-Type": "text/plain"})
        response.write("404 Not Found\n")
        response.end()
        return
      }

      response.writeHead(500, {...HEADERS, "Content-Type": "text/plain"})
      response.write("500 Internal Server Error\n")
      response.end()
      console.error(`ERROR: ${request.url} ${error}`)
    })
    return
  }

  // App serve
  staticServe(suffix, APP_PATH).then(([fileStream, mime]) => {
    response.writeHead(200, {...HEADERS, "Content-Type": mime})
    fileStream.pipe(response)
  }).catch(error => {
    if (error.code === "ENOENT") {
      const fileStream = createReadStream(APP_INDEX)
      response.writeHead(200, {...HEADERS, "Content-Type": "text/html" })
      fileStream.pipe(response)
      return
    }

    response.writeHead(500, {...HEADERS, "Content-Type": "text/plain"})
    response.write("500 Internal Server Error\n")
    response.end()
    console.error(`ERROR: ${request.url} ${error}`)
  })
}

void async function main() {
  const cert = await fs.readFile(path.resolve(__dirname, `./ecdsa.crt`))
  const key = await fs.readFile(path.resolve(__dirname, `./ecdsa.key`))
  const httpServer = createServer({ cert, key },router)
  await new Promise(resolve => httpServer.listen({ host: "localhost", port: workerData || 8080, exclusive: true, }, resolve))
  console.log(`Server listening https://localhost:${workerData || 8080}`)
  parentPort?.on("message", ({command} = {}) => command === "close" && httpServer.close())
  parentPort?.postMessage({ success: true })
}()
