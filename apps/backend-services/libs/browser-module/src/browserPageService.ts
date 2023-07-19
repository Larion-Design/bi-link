import { Injectable } from '@nestjs/common'
import { Page } from 'puppeteer-core'

@Injectable()
export class BrowserPageService {
  async type(page: Page, inputSelector: string, value: string) {
    await page.waitForSelector(inputSelector)
    const element = await page.$(inputSelector)

    if (element) {
      await element.focus()
      await element.type(value, { delay: this.getRandomDelay(50, 100) })
    }
  }

  async fillForm(page: Page, selectorValues: Record<string, string>) {
    await Promise.all(
      Object.entries(selectorValues).map(async ([selector, value]) =>
        this.type(page, selector, value),
      ),
    )
  }

  private getRandomDelay = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min) + min)
}
