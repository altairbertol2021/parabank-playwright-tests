import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { defaultUser } from '../support/factories/user.factory'
import { RegisterPage } from '../pages/register.page'

test.describe('Login com sucesso - pré-condição local', () => {

    const user = {
        firstName: 'Login',
        lastName: 'Success',
        username: 'tech',
        password: 'admin'
    }

    test.beforeEach(async ({ page }) => {
        const registerPage = new RegisterPage(page)

        // Pré-condição: garantir que o usuário exista
        await registerPage.goto()
        await registerPage.openRegister()
        await registerPage.fillPersonalInfo(user.firstName, user.lastName)
        await registerPage.fillAddress()
        await registerPage.fillCredentials(
            user.username,
            user.password,
            user.password
        )
        await registerPage.submit()
    })

    test.only('login com sucesso', async ({ page }) => {
        const loginPage = new LoginPage(page)

        await loginPage.goto()
        await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking')

        await loginPage.login(defaultUser.username, defaultUser.password)
        await loginPage.assertLoginSuccess()
    })
})

test('login com senha incorreta', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking')

    await loginPage.login('tech', 'admin1')
    await loginPage.assertLoginError()
})

test('login com usuário inexistente', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking')

    await loginPage.login('techh', 'admin')
    await loginPage.assertLoginError()
})

test('login com campos vazios', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking')

    await loginPage.login('', '')
    await loginPage.assertEmptyCredentialsError()
})