export { AbstractComponent } from "./abstract/abstract.mjs"
export * from "./ss-page/ss-page.mjs"
export * from "./ss-page-iframe/ss-page-iframe.mjs"
export * from "./ss-page-landing/ss-page-landing.mjs"
export * from "./ss-page-main/ss-page-main.mjs"
export * from "./ss-router/ss-router.mjs"
export * from "./ss-slider/ss-slider.mjs"

import { InitComponents } from "./abstract/abstract.mjs"
import * as COMPONENTS from "./index.mjs"
await InitComponents(COMPONENTS)