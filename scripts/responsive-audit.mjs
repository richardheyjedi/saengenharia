import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseURL = process.env.AUDIT_BASE_URL ?? 'http://127.0.0.1:4174'
const outputDir = new URL('../audit-output/', import.meta.url)

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ executablePath, headless: true })
const results = []

for (const device of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 900 },
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
  await page.locator('.reference-hero').screenshot({ path: new URL(`${device.name}-hero.png`, outputDir).pathname.slice(1) })
  await page.locator('.reference-gallery').screenshot({ path: new URL(`${device.name}-gallery.png`, outputDir).pathname.slice(1) })

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

  const galleryCards = page.locator('.reference-gallery__card')
  const galleryCount = await galleryCards.count()
  const allGalleryImagesLoaded = await galleryCards.locator('img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))
  await galleryCards.first().click()
  const lightboxOpened = await page.locator('.reference-lightbox').isVisible()
  await page.getByRole('button', { name: 'Fechar galeria' }).click()
  const lightboxClosed = await page.locator('.reference-lightbox').count() === 0
  const gallery = { galleryCount, allGalleryImagesLoaded, lightboxOpened, lightboxClosed }

  let mobileMenu = null
  if (device.width <= 860) {
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await page.waitForTimeout(250)
    mobileMenu = await page.locator('#reference-main-menu').evaluate((menu) => ({
      visible: getComputedStyle(menu).opacity === '1',
      expanded: document.querySelector('.menu-button')?.getAttribute('aria-expanded'),
    }))
    await page.locator('#reference-main-menu a[href="#servicos"]').click()
    await page.waitForTimeout(350)
    mobileMenu.afterNavigationHash = await page.evaluate(() => location.hash)
    mobileMenu.bodyLockedAfterNavigation = await page.evaluate(() => document.body.classList.contains('menu-open'))
  }

  results.push({ device, ...baseChecks, gallery, mobileMenu, missingResources, consoleErrors })
  await page.close()
}

await browser.close()
console.log(JSON.stringify(results, null, 2))
