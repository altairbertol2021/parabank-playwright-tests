import { test, expect } from '@playwright/test'
import { RegisterPage } from '../pages/register.page'
import { createValidUser } from '../support/factories/user.factory'

test('cadastro de novo usuário com sucesso', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    const user = createValidUser()

    await registerPage.goto()
    await registerPage.openRegister()

    await expect(page.getByRole('heading', { name: 'Signing up is easy!' })).toBeVisible()

    await registerPage.fillPersonalInfo(user.firstName, user.lastName)
    await registerPage.fillAddress()
    await registerPage.fillCredentials(user.username, user.password, user.password);
    await registerPage.submit()
})

test('cadastro com campos obrigatórios vazios', async ({ page }) => {
    const registerPage = new RegisterPage(page)

    await registerPage.goto()
    await registerPage.openRegister()
    await registerPage.submit()

    const requiredErrors = [
        'First name is required.',
        'Last name is required.',
        'Address is required.',
        'City is required.',
        'State is required.',
        'Zip Code is required.',
        'Social Security Number is required.',
        'Username is required.',
        'Password is required.',
        'Password confirmation is required.'
    ];

    const errors = await page.locator('.error').allTextContents();

    for (const message of requiredErrors) {
        expect(errors).toContain(message)
    }
})

test('cadastro informando senha e confirmação diferentes', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    const user = createValidUser()

    await registerPage.goto()
    await registerPage.openRegister()

    await expect(page.getByRole('heading', { name: 'Signing up is easy!' })).toBeVisible()

    await registerPage.fillPersonalInfo(user.firstName, user.lastName)
    await registerPage.fillAddress()
    await registerPage.fillCredentials(user.username, user.password, `${user.password}123`)
    await registerPage.submit()

    await expect(page.locator('.error')).toHaveText('Passwords did not match.')
})

test.describe('Cadastro - Username já existente', () => {

    const existingUser = {
        firstName: 'Test',
        lastName: 'User',
        username: 'usuario_existente_qa',
        password: 'admin123'
    }

    test.beforeEach(async ({ page }) => {
        const registerPage = new RegisterPage(page)

        // Pré-condição apenas deste describe
        await registerPage.goto()
        await registerPage.openRegister()
        await registerPage.fillPersonalInfo(
            existingUser.firstName,
            existingUser.lastName
        )
        await registerPage.fillAddress()
        await registerPage.fillCredentials(
            existingUser.username,
            existingUser.password,
            existingUser.password
        )
        await registerPage.submit()
    })

    test('deve exibir erro ao cadastrar username já existente', async ({ page }) => {
        const registerPage = new RegisterPage(page)

        await registerPage.goto()
        await registerPage.openRegister()
        await registerPage.fillPersonalInfo(
            existingUser.firstName,
            existingUser.lastName
        )
        await registerPage.fillAddress()
        await registerPage.fillCredentials(
            existingUser.username,
            existingUser.password,
            existingUser.password
        )
        await registerPage.submit()

        await expect(page.locator('.error'))
            .toHaveText('This username already exists.')
    })
})

test('cadastro sem Zip Code (validação apenas de obrigatoriedade)', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    const user = createValidUser()

    await registerPage.goto()
    await registerPage.openRegister()

    await expect(page.getByRole('heading', { name: 'Signing up is easy!' })).toBeVisible()

    await registerPage.fillPersonalInfo(user.firstName, user.lastName)
    await registerPage.fillAddress({ zipCode: '' })
    await registerPage.fillCredentials(user.username, user.password, user.password)
    await registerPage.submit()

    await expect(page.locator('.error')).toHaveText('Zip Code is required.')
})