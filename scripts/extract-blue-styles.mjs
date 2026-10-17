import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const url = 'https://www.bluepremoldados.com.br/'
const research = new URL('../docs/research/bluepremoldados-com-br-23833e36/root-8a5edab2/', import.meta.url)
const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const selectors = ['.site-header', '.hero', '.solutions-overview', '.services', '.gallery', '.benefits-compact', '.about-compact', '.company-video', '.contact', 'footer']
const props = [
  'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'color', 'textTransform',
  'backgroundColor', 'background', 'padding', 'margin', 'width', 'height', 'maxWidth', 'minHeight',
  'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap', 'gridTemplateColumns', 'gridTemplateRows',
  'borderRadius', 'border', 'boxShadow', 'overflow', 'position', 'top', 'right', 'bottom', 'left', 'zIndex',
  'opacity', 'transform', 'transition', 'cursor', 'objectFit', 'objectPosition', 'filter', 'backdropFilter',
]

const browser = await chromium.launch({ executablePath, headless: true })
const output = {}
const behaviors = { url, capturedAt: new Date().toISOString(), header: {}, desktop: {}, mobile: {} }

for (const device of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: { width: device.width, height: device.height } })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(800)

  output[device.name] = await page.evaluate(({ selectors, props }) => {
    const extractStyles = (element) => {
      const css = getComputedStyle(element)
      return Object.fromEntries(props.map((prop) => [prop, css[prop]]).filter(([, value]) => value && value !== 'none' && value !== 'normal' && value !== 'auto' && value !== '0px' && value !== 'rgba(0, 0, 0, 0)'))
    }
    const walk = (element, depth = 0) => {
      if (depth > 3) return null
      const children = [...element.children].slice(0, 18)
      return {
        tag: element.tagName.toLowerCase(),
        classes: typeof element.className === 'string' ? element.className.split(' ').slice(0, 6).join(' ') : '',
        text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 ? element.textContent.trim().slice(0, 240) : null,
        styles: extractStyles(element),
        rect: Object.fromEntries(['x', 'y', 'width', 'height'].map((key) => [key, Math.round(element.getBoundingClientRect()[key] * 100) / 100])),
        image: element.tagName === 'IMG' ? { src: element.currentSrc || element.src, alt: element.alt, naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight } : null,
        children: children.map((child) => walk(child, depth + 1)).filter(Boolean),
      }
    }
    return Object.fromEntries(selectors.map((selector) => {
      const element = document.querySelector(selector)
      return [selector, element ? walk(element) : null]
    }))
  }, { selectors, props })

  if (device.name === 'desktop') {
    let trigger = null
    for (let y = 0; y <= 240; y += 10) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await page.waitForTimeout(45)
      const solid = await page.locator('.site-header').evaluate((header) => header.classList.contains('is-solid'))
      if (solid) { trigger = y; break }
    }
    behaviors.header = { trigger, model: 'scroll-driven', transition: output.desktop['.site-header']?.styles.transition }

    await page.evaluate(() => window.scrollTo(0, 0))
    const heroLinks = page.locator('.hero a')
    const heroLinkCount = await heroLinks.count()
    const buttons = []
    for (let index = 0; index < heroLinkCount; index += 1) {
      const link = heroLinks.nth(index)
      const before = await link.evaluate((element) => { const css = getComputedStyle(element); return { background: css.background, color: css.color, transform: css.transform, border: css.border, transition: css.transition } })
      await link.hover()
      await page.waitForTimeout(220)
      const after = await link.evaluate((element) => { const css = getComputedStyle(element); return { background: css.background, color: css.color, transform: css.transform, border: css.border, transition: css.transition } })
      buttons.push({ text: await link.textContent(), before, after })
    }
    behaviors.desktop.heroButtons = buttons
    behaviors.desktop.galleryButtons = await page.locator('.gallery button').evaluateAll((elements) => elements.map((element) => ({ ariaLabel: element.getAttribute('aria-label'), text: element.textContent.trim(), className: element.className })))
  } else {
    const headerButtons = page.locator('.site-header button')
    behaviors.mobile.headerButtons = await headerButtons.evaluateAll((elements) => elements.map((element) => ({ ariaLabel: element.getAttribute('aria-label'), className: element.className })))
    if (await headerButtons.count()) {
      await headerButtons.first().click()
      await page.waitForTimeout(250)
      behaviors.mobile.menuAfterClick = await page.locator('.site-header').evaluate((header) => ({ className: header.className, text: header.textContent.replace(/\\s+/g, ' ').trim(), bodyOverflow: getComputedStyle(document.body).overflow }))
    }
  }

  await page.close()
}

await browser.close()
await writeFile(new URL('COMPONENT_STYLES.json', research), JSON.stringify(output, null, 2))
await writeFile(new URL('BEHAVIORS.json', research), JSON.stringify(behaviors, null, 2))
console.log(JSON.stringify(behaviors, null, 2))
