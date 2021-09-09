#!/usr/bin/env node

const { promises:fs } = require("fs")
const path = require("path")

const BUILD_PATH = path.resolve(__dirname, "build")
const SRC_OBJECTS = [
  "app",
  "content",
  "main.js",
  "server.js",
  "window-options.js",
  "id.txt",
  "ecdsa.crt",
  "ecdsa.key",
]

async function copy(src, dst) {
  const stat = await fs.stat(src)
  if (stat.isDirectory()) {
    try {
      await fs.mkdir(dst)
    } catch (err) {
      if (err.code !== "EEXIST") throw err
    }

    const files = await fs.readdir(src)
    for await (const file of files) {
      await copy(path.join(src, file), path.join(dst, file))
    }
    return
  }

  await fs.copyFile(src, dst)
}

void async function main() {
  for (const src of SRC_OBJECTS) {
    await copy(path.resolve(__dirname, src),  path.join(BUILD_PATH,src))
  }

  const PACKAGE = require("./package.json")
  delete PACKAGE.scripts
  delete PACKAGE.devDependencies

  await fs.writeFile(
    path.join(BUILD_PATH, "package.json"),
    JSON.stringify(PACKAGE),
    "utf8",
  )
}()