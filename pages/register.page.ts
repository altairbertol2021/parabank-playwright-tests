import { Page } from '@playwright/test'
import { User } from '../support/factories/user.factory'

export class RegisterPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }

    async register(user: User) {
        await this.goto()
        await this.openRegister()
        await this.fillPersonalInfo(user.firstName, user.lastName)
        await this.fillAddress()
        await this.fillCredentials(user.username, user.password, user.password)
        await this.submit()
    }

    async goto() {
        await this.page.goto('/')
    }

    async openRegister() {
        await this.page.getByRole('link', { name: 'Register' }).click()
    }

    async fillPersonalInfo(firstName: string, lastName: string) {
        await this.page.fill('[id="customer.firstName"]', firstName)
        await this.page.fill('[id="customer.lastName"]', lastName)
    }

    async fillAddress(options?: { zipCode?: string }) {
        const zipCode = options?.zipCode ?? '89227345'

        await this.page.fill('[id="customer.address.street"]', 'Rua São Paulo')
        await this.page.fill('[id="customer.address.city"]', 'Joinville')
        await this.page.fill('[id="customer.address.state"]', 'SC')
        await this.page.fill('[id="customer.address.zipCode"]', zipCode)
        await this.page.fill('[id="customer.phoneNumber"]', '11992014110')
        await this.page.fill('[id="customer.ssn"]', '12345');
    }

    async fillCredentials(username: string, password: string, confirmPassword: string) {
        await this.page.fill('[id="customer.username"]', username)
        await this.page.fill('[id="customer.password"]', password)
        await this.page.fill('#repeatedPassword', confirmPassword)
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Register' }).click()
    }
}