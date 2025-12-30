import { test } from '@playwright/test'
import { RegisterPage } from '../pages/register.page'
import { AccountsPage } from '../pages/accounts.page'
import { createValidUser } from '../support/factories/user.factory'

let accountsPage: AccountsPage

test.beforeEach(async ({ page }) => {
    const registerPage = new RegisterPage(page)
    accountsPage = new AccountsPage(page)

    const user = createValidUser()

    await registerPage.goto()
    await registerPage.register(user)
})

test('abertura de conta Savings', async () => {
    await accountsPage.openNewAccountMenu()
    await accountsPage.selectAccountType('SAVINGS')
    await accountsPage.selectFirstAvailableAccount()
    await accountsPage.submitOpenAccount()

    await accountsPage.assertAccountOpened()
})

test('abertura de conta Checking', async () => {
    await accountsPage.openNewAccountMenu()
    await accountsPage.selectAccountType('CHECKING')
    await accountsPage.selectFirstAvailableAccount()
    await accountsPage.submitOpenAccount()

    await accountsPage.assertAccountOpened()
})

test('exibir accounts overview com pelo menos uma conta válida', async () => {
    await accountsPage.openAccountsOverview()

    await accountsPage.assertAccountsOverviewVisible()
    await accountsPage.assertAtLeastOneValidAccount()
})