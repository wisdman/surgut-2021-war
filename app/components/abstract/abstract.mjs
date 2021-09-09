const TAG = "TAG_NAME"

const STYLES = "STYLES"
const STYLES_SYMBOL = Symbol(STYLES)

const TEMPLATE = "TEMPLATE"
const TEMPLATE_SYMBOL = Symbol(TEMPLATE)

const HTML = "HTML"
const HTML_SYMBOL = Symbol(HTML)

const DEFINE = "INIT"
const DEFINE_SYMBOL = Symbol(DEFINE)

export class AbstractComponent extends HTMLElement {
  static [TAG] = undefined

  static get [STYLES_SYMBOL]() {
    return [
      ...(Object.getPrototypeOf(this)[STYLES_SYMBOL] ?? []),
      ...(this.hasOwnProperty(STYLES) ? [this[STYLES]].flat() : [])
    ]
  }

  static get [TEMPLATE_SYMBOL]() {
    return this.hasOwnProperty(TEMPLATE) ? this[TEMPLATE] : ""
  }

  static get [HTML_SYMBOL]() {
    return this[STYLES_SYMBOL].map(s => `<link rel="stylesheet" type="text/css" href="${s}">`).join("")
         + this[TEMPLATE_SYMBOL]
  }

  static [DEFINE_SYMBOL]() {
    if (!this.hasOwnProperty(TAG) || typeof this[TAG] !== "string") return
    customElements.define(this[TAG], this)
  }

  $ = (selector, { root = true, host = true } = {}) => {
    return root && this.shadowRoot.querySelector(selector) ||
           host && this.querySelector(selector)
  }

  $$ = (selector, { root = true, host = true } = {}) => {
    return [
      ...(root ? this.shadowRoot.querySelectorAll(selector) : []),
      ...(host ? this.querySelectorAll(selector) : []),
    ]
  }

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.shadowRoot.innerHTML = Object.getPrototypeOf(this).constructor[HTML_SYMBOL]
  }
}

export async function InitComponents(components) {
  for (const component of Object.values(components)) {
    if (component[DEFINE_SYMBOL]) component[DEFINE_SYMBOL]()
  }
}
