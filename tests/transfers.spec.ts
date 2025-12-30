import { test } from '@playwright/test'
import { RegisterPage } from '../pages/register.page'
import { TransfersPage } from '../pages/transfers.page'
import { createValidUser } from '../support/factories/user.factory'
import { AccountsPage } from '../pages/accounts.page'

test.describe('Transferências', () => {
  let transfersPage: TransfersPage

  test.beforeEach(async ({ page }) => {
    const registerPage = new RegisterPage(page)
    const accountsPage = new AccountsPage(page)

    const user = createValidUser()

    // Registra o usuário
    await registerPage.goto()
    await registerPage.register(user)

    // Setup do teste: criação de contas para viabilizar os fluxos de transferências
    await accountsPage.openNewAccountMenu()
    await accountsPage.selectAccountType('SAVINGS')
    await accountsPage.selectFirstAvailableAccount()
    await accountsPage.submitOpenAccount()

    await accountsPage.assertAccountOpened()

    // Setup do teste: criação de contas para viabilizar os fluxos de transferências
    await accountsPage.openNewAccountMenu()
    await accountsPage.selectAccountType('CHECKING')
    await accountsPage.selectFirstAvailableAccount()
    await accountsPage.submitOpenAccount()

    await accountsPage.assertAccountOpened()

    transfersPage = new TransfersPage(page)
  })

  test('deve transferir valor válido entre contas com sucesso', async () => {
    await transfersPage.openTransferFundsMenu()
    await transfersPage.fillAmount('10')
    await transfersPage.selectDifferentAccounts()
    await transfersPage.submitTransfer()

    await transfersPage.assertTransferSuccess()
  })

  test('exibe erro técnico ao submeter transferência sem valor', async () => {
    await transfersPage.openTransferFundsMenu()
    await transfersPage.selectDifferentAccounts()
    await transfersPage.submitTransfer()

    await transfersPage.assertTransferError()
  })

  test('retorna erro ao submeter transferência com valor inválido', async () => {
    await transfersPage.openTransferFundsMenu()
    await transfersPage.fillAmount('abc')
    await transfersPage.selectDifferentAccounts()
    await transfersPage.submitTransfer()

    await transfersPage.assertTransferError()
  })
})