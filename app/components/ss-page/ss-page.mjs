import { AbstractComponent } from "../abstract/abstract.mjs"
import { CSS } from "../abstract/utils.mjs"

const STYLE = CSS(import.meta.url)
const RANDOM = () => Math.round(Math.random()*10**10).toString(16)

export class SSPage extends AbstractComponent {
  static STYLES = STYLE

  constructor({id = RANDOM(), class:nodeClass = ""} = {}) {
    super()
    this.id = id
    nodeClass && this.classList.add(nodeClass)
  }
}