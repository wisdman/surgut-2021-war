import { CSS, HTML, CONTENT } from "../abstract/utils.mjs"
import { SSPage } from "../ss-page/ss-page.mjs"

const STYLE = CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

export class SSPageIFrame extends SSPage {
  static TAG_NAME = "ss-page-iframe"

  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  #iftameNode = this.$("iframe")

  constructor({dir, ...args} = {}) {
    super(args)
    if (!dir) throw new Error(`Incorrect content dir "${dir}"`)
    this.#iftameNode.src = `${CONTENT}/${dir}/index.html`
  }
}