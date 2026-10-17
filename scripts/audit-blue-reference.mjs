import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const url = 'https://www.bluepremoldados.com.br/'
const screenshots = new URL('../docs/design-references/bluepremoldados-com-br-23833e36/root-8a5edab2/', import.meta.url)
const research = new URL('../docs/research/bluepremoldados-com-br-23833e36/root-8a5edab2/', import.meta.url)
const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ executablePath, headless: true })
const report = { url, capturedAt: new Date().toISOString(), viewports: {} }

for (const device of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: { width: device.width, height: device.height }, deviceScaleFactor: 1 })
  const consoleErrors = []
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  page.on('pageerror', (error) => consoleErrors.push(error.message))
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1200)

  const topState = await page.evaluate(() => {
    const header = document.querySelector('header')
    if (!header) return null
    const style = getComputedStyle(header)
    return { className: header.className, position: style.position, background: style.background, height: header.getBoundingClientRect().height, boxShadow: style.boxShadow, transform: style.transform, transition: style.transition }
  })

  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight)
  const sectionShots = []
  for (let position = 0, index = 0; position < pageHeight; position += Math.max(600, Math.floor(device.height * 0.82)), index += 1) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), position)
    await page.waitForTimeout(180)
    if (device.name === 'desktop') {
      const filename = `desktop-section-${String(index + 1).padStart(2, '0')}.png`
      await page.screenshot({ path: new URL(filename, screenshots).pathname.slice(1) })
      sectionShots.push(filename)
    }
  }

  const scrolledState = await page.evaluate(() => {
    const header = document.querySelector('header')
    if (!header) return null
    const style = getComputedStyle(header)
    return { className: header.className, position: style.position, background: style.background, height: header.getBoundingClientRect().height, boxShadow: style.boxShadow, transform: style.transform, transition: style.transition }
  })

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(300)
  await page.screenshot({ path: new URL(`${device.name}-full.png`, screenshots).pathname.slice(1), fullPage: true })

  const data = await page.evaluate(() => {
    const selectors = ['body', 'header', 'main', 'h1', 'h2', 'p', 'a', 'button']
    const styles = Object.fromEntries(selectors.map((selector) => {
      const element = document.querySelector(selector)
      if (!element) return [selector, null]
      const css = getComputedStyle(element)
      return [selector, {
        fontFamily: css.fontFamily,
        fontSize: css.fontSize,
        fontWeight: css.fontWeight,
        lineHeight: css.lineHeight,
        letterSpacing: css.letterSpacing,
        color: css.color,
        background: css.background,
        padding: css.padding,
        margin: css.margin,
        borderRadius: css.borderRadius,
        textTransform: css.textTransform,
      }]
    }))

    const sections = [...document.querySelectorAll('body main > *, body > section')].map((element, index) => {
      const rect = element.getBoundingClientRect()
      const css = getComputedStyle(element)
      return {
        index,
        tag: element.tagName.toLowerCase(),
        id: element.id,
        className: typeof element.className === 'string' ? element.className : '',
        top: rect.top + scrollY,
        height: rect.height,
        background: css.background,
        color: css.color,
        headings: [...element.querySelectorAll('h1,h2,h3')].map((heading) => heading.textContent.trim()),
        textSample: element.textContent.replace(/\\s+/g, ' ').trim().slice(0, 500),
      }
    })

    return {
      title: document.title,
      lang: document.documentElement.lang,
      dimensions: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, viewportWidth: innerWidth },
      styles,
      fonts: [...new Set([...document.querySelectorAll('*')].slice(0, 500).map((element) => getComputedStyle(element).fontFamily))],
      colors: [...new Set([...document.querySelectorAll('*')].slice(0, 500).flatMap((element) => {
        const css = getComputedStyle(element)
        return [css.color, css.backgroundColor, css.borderColor]
      }).filter((value) => value && value !== 'rgba(0, 0, 0, 0)'))],
      headings: [...document.querySelectorAll('h1,h2,h3')].map((element) => ({ tag: element.tagName, text: element.textContent.trim() })),
      navigation: [...document.querySelectorAll('header a')].map((element) => ({ text: element.textContent.trim(), href: element.href })),
      images: [...document.querySelectorAll('img')].map((image) => ({ src: image.currentSrc || image.src, alt: image.alt, width: image.naturalWidth, height: image.naturalHeight, loading: image.loading })),
      backgroundImages: [...document.querySelectorAll('*')].map((element) => ({ element: `${element.tagName.toLowerCase()}.${String(element.className).split(' ')[0]}`, value: getComputedStyle(element).backgroundImage })).filter((item) => item.value && item.value !== 'none'),
      videos: [...document.querySelectorAll('video')].map((video) => ({ src: video.currentSrc || video.src, poster: video.poster, autoplay: video.autoplay, loop: video.loop, muted: video.muted })),
      favicons: [...document.querySelectorAll('link[rel*="icon"]')].map((link) => ({ href: link.href, sizes: link.sizes?.toString() })),
      sections,
      hasLenis: document.documentElement.classList.contains('lenis') || Boolean(document.querySelector('.lenis')),
    }
  })

  report.viewports[device.name] = { ...device, topState, scrolledState, sectionShots, consoleErrors, ...data }
  await page.close()
}

await browser.close()
await writeFile(new URL('REFERENCE_AUDIT.json', research), JSON.stringify(report, null, 2))
console.log(JSON.stringify({
  title: report.viewports.desktop.title,
  desktopHeight: report.viewports.desktop.dimensions.scrollHeight,
  sectionCount: report.viewports.desktop.sections.length,
  images: report.viewports.desktop.images.length,
  videos: report.viewports.desktop.videos.length,
  fonts: report.viewports.desktop.fonts,
  errors: report.viewports.desktop.consoleErrors,
}, null, 2))
