import { AbstractComponent } from "../abstract/abstract.mjs"
import { CSS, HTML, CONTENT } from "../abstract/utils.mjs"

import { SSPageBook } from "../ss-page-book/ss-page-book.mjs"
import { SSPageLanding } from "../ss-page-landing/ss-page-landing.mjs"
import { SSPageMain } from "../ss-page-main/ss-page-main.mjs"

const STYLE = CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

const DATA = await (await fetch(`${CONTENT}/data.json`)).json()

export class SSRouter extends AbstractComponent {
  static TAG_NAME = "ss-router"
  
  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  #backButton = this.$("button#back")

  #getPageClass = type => {
    switch(type) {
      case "book":
        return SSPageBook
      case "landing":
        return SSPageLanding
      case "main":
        return SSPageMain
    }
    throw new Error(`Incorrect page type "${type}"`)
  }

  #pages = DATA.items.reduce((acc, {type, ...data}) => (
    {...acc, [`/${data.dir}`]:this.appendChild(new (this.#getPageClass(type))({...data}))}),
    {"/": this.appendChild(new (this.#getPageClass("main"))({...DATA})) }
  )

  navigate = pathname => {
    const pageNode = this.#pages[pathname]
    requestAnimationFrame(() => {
      Object.values(this.#pages).forEach(pageNode => {
        pageNode.classList.remove("active")
      })
      pageNode.classList.add("active")
      if (pathname === "/") this.#backButton.classList.add("hide")
      else this.#backButton.classList.remove("hide")
    })
  }

  #onNavigate = event => {
    event.preventDefault()
    const pathname = new URL(event.destination.url).pathname
    this.navigate(pathname)
  }

  #onBack = event => {
    event.preventDefault()
    this.navigate("/")
  }

  connectedCallback() {
    appHistory.addEventListener("navigate", this.#onNavigate, { capture: true })
    this.#backButton.addEventListener("click", this.#onBack, { capture: true })
    this.navigate(location.pathname)
  }
  
  disconnectedCallback() {
    this.#backButton.removeEventListener("click", this.#onBack, { capture: true })
    appHistory.removeEventListener("navigate", this.#onNavigate, { capture: true })
  }
}