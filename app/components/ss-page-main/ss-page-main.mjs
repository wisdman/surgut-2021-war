import { CSS, HTML, CONTENT } from "../abstract/utils.mjs"
import { SSPage } from "../ss-page/ss-page.mjs"

const STYLE = CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

export class SSPageMain extends SSPage {
  static TAG_NAME = "ss-page-main"

  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  #cardTemplate = (() => {
    const cardTemplate = this.$("template#card").innerHTML
    return new Function("$",`return \`${cardTemplate}\` `)
  })()

  #appendCard = data => {
    data.title = data.title.replace(/[\r\n]+/g,"<br>")
    const template = document.createElement("template")
    template.innerHTML = this.#cardTemplate({...data, image: `${CONTENT}/${data.dir}/${data.image}`})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  #appendTitle = (data, subtitle = false) => {
    const titleNode = document.createElement("h1")
    titleNode.classList.add("title")
    subtitle && titleNode.classList.add("title--sub")
    titleNode.innerHTML = data.replace(/[\r\n]+/g,"<br>")
    this.shadowRoot.appendChild(titleNode)
  }

  constructor({title = "", subtitles = [], items = [], ...args} = {}) {
    super(args)
    this.#appendTitle(title)
    subtitles.forEach(item => this.#appendTitle(item, true))
    items.forEach(item => this.#appendCard(item))
  }
}
