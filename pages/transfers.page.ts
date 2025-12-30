import { Page, expect } from '@playwright/test'

export class TransfersPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async openTransferFundsMenu() {
        const link = this.page.getByRole('link', { name: 'Transfer Funds' })

        await expect(link).toBeVisible()

        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            this.page.waitForURL(/transfer\.htm/),
            link.click()
        ])
    }

    async fillAmount(amount: string) {
        const amountInput = this.page.locator('#amount')

        await expect(amountInput).toBeVisible()
        await expect(amountInput).toBeEnabled()

        await amountInput.fill(amount)
    }

    async selectDifferentAccounts() {
        const fromSelect = this.page.locator('#fromAccountId')
        const toSelect = this.page.locator('#toAccountId')

        await expect(fromSelect).toBeVisible()
        await expect(toSelect).toBeVisible()

        const fromOptions = fromSelect.locator('option')
        await expect(fromOptions).not.toHaveCount(0)

        // Seleciona conta de origem
        const fromValue = await fromOptions.first().getAttribute('value')
        await fromSelect.selectOption(fromValue!)

        // Aguarda o backend atualizar o select de destino
        await this.page.waitForFunction(() => {
            const select = document.querySelector<HTMLSelectElement>('#toAccountId')
            return select && select.options.length >= 1
        })

        const toOptions = toSelect.locator('option')
        const toCount = await toOptions.count()

        if (toCount < 1) {
            throw new Error('Pré-condição inválida: nenhuma conta disponível para destino')
        }

        // Seleciona conta de destino (diferente da origem)
        const toValue = await toOptions.first().getAttribute('value')
        await toSelect.selectOption(toValue!)
    }

    async submitTransfer() {
        const button = this.page.getByRole('button', { name: 'Transfer' })
        await expect(button).toBeVisible()
        await button.click()
    }

    async assertTransferSuccess() {
        await expect(this.page.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible()
    }

    async assertTransferError() {
        await expect(
            this.page.getByRole('heading', { name: 'Error!' })).toBeVisible()
        await expect(this.page.locator('#rightPanel')).toContainText('An internal error has occurred and has been logged.')
    }
}