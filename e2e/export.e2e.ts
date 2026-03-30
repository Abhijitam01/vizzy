import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import os from 'os'

test.describe('export flow', () => {
  test('load GET template → click Export → server.js downloads', async ({ page }) => {
    await page.goto('/')

    // Template loader should be visible (no nodes on canvas yet)
    const getTemplateBtn = page.getByTestId('template-get-endpoint')
    await expect(getTemplateBtn).toBeVisible()
    await getTemplateBtn.click()

    // Canvas should now have blocks — template loader dismissed
    await expect(getTemplateBtn).not.toBeVisible()

    // Code panel should show express boilerplate
    const codePanel = page.locator('.token')
    await expect(codePanel.first()).toBeVisible()

    // Set up download listener before clicking Export
    const downloadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vizzy-e2e-'))
    const downloadPromise = page.waitForEvent('download')

    const exportBtn = page.getByTestId('export-button')
    await expect(exportBtn).toBeVisible()
    await exportBtn.click()

    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe('server.js')

    // Save and verify content
    const savePath = path.join(downloadDir, download.suggestedFilename())
    await download.saveAs(savePath)

    const content = fs.readFileSync(savePath, 'utf-8')
    expect(content).toContain("require('express')")
    expect(content).toContain('app.listen')
    expect(content).toContain('app.get')

    // Cleanup
    fs.rmSync(downloadDir, { recursive: true, force: true })
  })

  test('code panel updates live when template loads', async ({ page }) => {
    await page.goto('/')

    const getTemplateBtn = page.getByTestId('template-get-endpoint')
    await getTemplateBtn.click()

    // The code panel should contain express content
    const codeContent = await page.locator('pre').textContent()
    expect(codeContent).toBeTruthy()
    expect(codeContent).toContain('express')
  })

  test('run button animates through blocks', async ({ page }) => {
    await page.goto('/')

    const getTemplateBtn = page.getByTestId('template-get-endpoint')
    await getTemplateBtn.click()

    const runBtn = page.getByTestId('run-button')
    await expect(runBtn).toBeVisible()
    await expect(runBtn).not.toBeDisabled()

    await runBtn.click()

    // Button text should change to indicate running state
    await expect(runBtn).toHaveText(/stop/i)
  })
})
