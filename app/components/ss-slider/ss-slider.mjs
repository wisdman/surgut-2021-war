import { AbstractComponent } from "../abstract/abstract.mjs"
import { CSS, HTML, CONTENT } from "../abstract/utils.mjs"

const STYLE = CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

export class SSSlider extends AbstractComponent {
  static TAG_NAME = "ss-slider"

  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  #backBtn = this.$("button#back")
  #wrapper = this.$("div#wrapper")

  #intersectionObserver = undefined
  #items = new Map()

  constructor(){
    super()
    this.#intersectionObserver = new IntersectionObserver(this.#intersectionObserverCallback, { threshold: 1 })
  }

  #intersectionObserverCallback = (entries) => {
    const target = entries.find(({intersectionRatio}) => intersectionRatio ===  1)?.target
    if (!target) return
    requestAnimationFrame(() => {
      for (const node of this.#items.values()) {
        if (node === target) node.classList.add("active")
        else node.classList.remove("active")

        target.previousElementSibling ? this.#wrapper.classList.remove("first") : this.#wrapper.classList.add("first")
        target.nextElementSibling ? this.#wrapper.classList.remove("last") : this.#wrapper.classList.add("last")
      }
    })
  }

  #hide = () => requestAnimationFrame(() => this.classList.remove("shown"))

  #show = event => {
    event.stopPropagation()
    const node = event?.path[0]
    if (!node) return
    const item = this.#items.get(node)
    if (!item) return
    item.scrollIntoView()
    requestAnimationFrame(() => this.classList.add("shown"))
  }

  #onItemPointeruUp = event => {
    event.stopPropagation()
    const item = event?.path[0]
    if (!item) return
    item.scrollIntoView({behavior: "smooth"})
  }

  #add = srcNode => {
    const itemNode = document.createElement("div")
    itemNode.classList.add("item")

    const img = new Image()
    img.classList.add("item-image")
    img.src = srcNode.src
    itemNode.appendChild(img)

    itemNode.addEventListener("pointerup", this.#onItemPointeruUp, { passive: true })
    this.#intersectionObserver.observe(itemNode)
    this.#wrapper.appendChild(itemNode)

    srcNode.addEventListener("pointerup", this.#show, { passive: true })
    this.#items.set(srcNode, itemNode)
  }

  connectedCallback() {
    this.#backBtn.addEventListener("pointerup", this.#hide, { capture: true })
    this.parentNode.querySelectorAll("img").forEach(img => this.#add(img))
  }

  disconnectedCallback() {
    this.#backBtn.removeEventListener("pointerup", this.#hide, { capture: true })
    this.#items.forEach((itemNode, srcNode, map) => {
      this.#intersectionObserver.unobserve(itemNode)
      itemNode.remove()
      srcNode.removeEventListener("pointerup", this.#show, { passive: true })
      map.delete(srcNode)
    })
  }

}