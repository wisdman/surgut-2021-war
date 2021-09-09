const MJS_RX = /\.mjs$/i

export const CSS = metaURL => metaURL.replace(MJS_RX,".css")
export const HTML = async metaURL => {
  const path = metaURL.replace(MJS_RX,".html")
  const response = await fetch(path)
  return await response.text()
}

export const ID = await Number.parseInt(await (await fetch("/id")).text())
export const CONTENT = `/content/SS-${ID}`