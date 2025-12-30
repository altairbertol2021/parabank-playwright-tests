import { Page, expect } from '@playwright/test'

export class AccountsPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async goto() {
        await this.page.goto('/parabank/openaccount.htm')
    }

    async openNewAccountMenu() {
        await this.page.getByRole('link', { name: 'Open New Account' }).click()
    }

    async selectAccountType(type: 'CHECKING' | 'SAVINGS') {
        const value = type === 'SAVINGS' ? '1' : '0'
        await this.page.selectOption('#type', value)
    }

    async selectFromAccount(accountNumber: string) {
        await this.page.selectOption('#fromAccountId', { label: accountNumber })
    }


    async submitOpenAccount() {
        const submitButton = this.page.getByRole('button', { name: 'Open New Account' })

        await expect(submitButton).toBeVisible()
        await submitButton.click()
    }

    async assertAccountOpened() {
        await expect(
            this.page.getByText('Account Opened!')
        ).toBeVisible()

        const newAccount = this.page.locator('#newAccountId')

        await expect(newAccount).toBeVisible()
        await expect(newAccount).not.toHaveText('')
    }

    async selectFirstAvailableAccount() {
        const fromAccountSelect = this.page.locator('#fromAccountId')

        // garante que o select está visível
        await expect(fromAccountSelect).toBeVisible()

        // pega o valor da primeira option
        const firstAccountValue = await fromAccountSelect
            .locator('option')
            .first()
            .getAttribute('value')

        if (!firstAccountValue) {
            throw new Error('Nenhuma conta disponível para transferência')
        }

        await fromAccountSelect.selectOption(firstAccountValue)
    }

    async openAccountsOverview() {
        await this.page.getByRole('link', { name: 'Accounts Overview' }).click()
    }

    async assertAccountsOverviewVisible() {
        await expect(
            this.page.getByRole('heading', { name: 'Accounts Overview' })
        ).toBeVisible()

        await expect(this.page.locator('#accountTable')).toBeVisible()
    }

    async assertAtLeastOneValidAccount() {
        const accountRows = this.page.locator('#accountTable tbody tr')

        // espera até existir pelo menos 1 linha
        await expect(accountRows.first()).toBeVisible()

        const count = await accountRows.count()
        expect(count).toBeGreaterThan(0)

        // valida que o ID da primeira conta é numérico
        const firstAccountId = await accountRows
            .first()
            .locator('td')
            .first()
            .textContent()

        expect(firstAccountId?.trim()).toMatch(/^\d+$/)
    }
}