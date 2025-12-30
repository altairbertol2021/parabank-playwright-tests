import { Page, expect } from '@playwright/test'
import { defaultUser } from '../support/factories/user.factory'

export class LoginPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async goto() {
        await this.page.goto('/', { waitUntil: 'domcontentloaded' })
        await this.page.getByRole('heading', { name: 'Customer Login' }).waitFor()
    }

    async login(username: string, password: string) {
        await this.page.fill('input[name="username"]', username)
        await this.page.fill('input[name="password"]', password)
        await this.page.click('input[type="submit"]');
    }

    // login encapsulado
    async loginDefaultUser() {
        await this.login(defaultUser.username, defaultUser.password)
    }

    async assertLoginSuccess() {
        await expect(
            this.page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible()
    }

    async assertLoginError() {
        await expect(this.page.getByRole('heading', { name: 'Error!' }))
            .toBeVisible();

        await expect(this.page.locator('.error'))
            .toHaveText('The username and password could not be verified.')
    }

    async assertEmptyCredentialsError() {
        await expect(this.page.getByRole('heading', { name: 'Error!' }))
            .toBeVisible();

        await expect(this.page.locator('.error'))
            .toHaveText('Please enter a username and password.')
    }
}