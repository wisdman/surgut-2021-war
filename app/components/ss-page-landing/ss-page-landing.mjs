import { CSS, HTML, CONTENT } from "../abstract/utils.mjs"
import { SSPage } from "../ss-page/ss-page.mjs"

const STYLE = CSS(import.meta.url)

export class SSPageLanding extends SSPage {
  static TAG_NAME = "ss-page-landing"

  static STYLES = STYLE

  #content = undefined

  constructor({dir, ...args} = {}) {
    super(args)
    if (!dir) throw new Error(`Incorrect content dir "${dir}"`)
    this.#content = `${CONTENT}/${dir}`
  }

  #onVideoClick = ({target}) => {
    if (target instanceof HTMLVideoElement) {
      requestAnimationFrame(() =>{
        if (target.paused) {
          target.play()
          target.classList.remove("paused")
        } else {
          target.pause()
          target.classList.add("paused")
          requestAnimationFrame(() =>target.currentTime = 0)
        }
      })
    }
  }

  async connectedCallback() {
    const template = document.createElement("template")
    template.innerHTML = await (await fetch(`${this.#content}/content.html`)).text()
    template.content.querySelectorAll("img, video").forEach(n => {
      n.setAttribute("src", `${this.#content}/${n.getAttribute("src")}`)
      if (n instanceof HTMLVideoElement) {
        const videoWrapper = document.createElement("div")
        videoWrapper.classList.add("video-wrapper")
        n.parentNode.insertBefore(videoWrapper, n)
        videoWrapper.appendChild(n)

        n.classList.add("paused")

        if (n.hasAttribute("poster")) {
          const posterNode = new Image()
          posterNode.src = `${this.#content}/${n.getAttribute("poster")}`
          posterNode.classList.add("video-poster")
          videoWrapper.appendChild(posterNode)
        }
      }
    })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$$("video").forEach(video => video.addEventListener("click", this.#onVideoClick, { capture: true }))
  }

  disconnectedCallback() {
    this.$$("video").forEach(video => video.removeEventListener("click", this.#onVideoClick, { capture: true }))
  }

}