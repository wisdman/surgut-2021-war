import { CSS, HTML } from "../abstract/utils.mjs"
import { SSPage } from "../ss-page/ss-page.mjs"

const STYLE = CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

export class SSPageBook extends SSPage {
  static TAG_NAME = "ss-page-book"

  static STYLES = STYLE
  static TEMPLATE = TEMPLATE
}