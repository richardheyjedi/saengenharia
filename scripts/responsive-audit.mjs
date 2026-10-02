import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseURL = 'http://127.0.0.1:4174'
const outputDir = new URL('../audit-output/', import.meta.url)

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ executablePath, headless: true })
const results = []

for (const device of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 360, height: 800 },
]) {
  const page = await browser.newPage({ viewport: { width: device.width, height: device.height }, deviceScaleFactor: 1 })
  const consoleErrors = []
  const missingResources = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(error.message))
  page.on('response', (response) => {
    if (response.status() === 404) missingResources.push(response.url())
  })

  await page.goto(baseURL, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let position = 0; position < pageHeight; position += Math.max(400, Math.floor(device.height * 0.7))) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), position)
    await page.waitForTimeout(70)
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(250)
  await page.screenshot({ path: new URL(`${device.name}.png`, outputDir).pathname.slice(1), fullPage: true })

  const baseChecks = await page.evaluate(() => {
    const actions = [...document.querySelectorAll('button, a.button')]
    return {
      title: document.title,
      language: document.documentElement.lang,
      h1Count: document.querySelectorAll('h1').length,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      contactButtonDisabled: document.querySelector('.button--contact')?.hasAttribute('disabled') ?? false,
      unavailableStatusVisible: Boolean(document.querySelector('#whatsapp-status')),
      whatsappFloatVisible: Boolean(document.querySelector('.whatsapp-float')),
      smallestVisibleAction: Math.min(...actions
        .filter((element) => {
          const rect = element.getBoundingClientRect()
          return getComputedStyle(element).display !== 'none' && rect.width > 0 && rect.height > 0
        })
        .map((element) => element.getBoundingClientRect().height)),
    }
  })

  const carouselBefore = await page.locator('.work-carousel__track').getAttribute('style')
  const slideCount = await page.locator('.work-carousel__slide').count()
  const loadedSlides = []
  for (let index = 0; index < slideCount; index += 1) {
    const activeImage = page.locator('.work-carousel__slide[aria-hidden="false"] img')
    await activeImage.waitFor({ state: 'visible' })
    loadedSlides.push(await activeImage.evaluate((image) => image.complete && image.naturalWidth > 0))
    if (index < slideCount - 1) {
      await page.getByRole('button', { name: 'Próxima imagem' }).click()
      await page.waitForTimeout(720)
    }
  }
  const carouselAfter = await page.locator('.work-carousel__track').getAttribute('style')
  const carousel = {
    slideCount,
    advancesWithControl: carouselBefore !== carouselAfter,
    allSlidesLoaded: loadedSlides.every(Boolean),
    activeIndicatorCount: await page.locator('.work-carousel__rail .is-active').count(),
  }

  let mobileMenu = null
  if (device.name === 'mobile') {
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await page.waitForTimeout(250)
    mobileMenu = await page.locator('#main-menu').evaluate((menu) => ({
      visible: getComputedStyle(menu).opacity === '1',
      expanded: document.querySelector('.menu-button')?.getAttribute('aria-expanded'),
    }))
    await page.locator('#main-menu a[href="#servicos"]').click()
    await page.waitForTimeout(350)
    mobileMenu.afterNavigationHash = await page.evaluate(() => location.hash)
    mobileMenu.bodyLockedAfterNavigation = await page.evaluate(() => document.body.classList.contains('menu-open'))
  }

  results.push({ device, ...baseChecks, carousel, mobileMenu, missingResources, consoleErrors })
  await page.close()
}

await browser.close()
console.log(JSON.stringify(results, null, 2))
