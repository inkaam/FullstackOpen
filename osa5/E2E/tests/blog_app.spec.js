const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // tyhjennys
    await request.post('http://localhost:3003/api/testing/reset')

    // käyttäjän luonti
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })
    // mennänä sivulle
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // mennään kirjautumis sivulle
    await page.goto('http://localhost:5173/login')
    // tarkistetaan että otsikko on näkyvissä "Log in to application'"
    await expect(
      page.getByText('Log in to application', { exact: false }),
    ).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // mennään kirjautumis sivulle
      await page.goto('http://localhost:5173/login')

      // täytetään inputit oikein
      await page.locator('input').first().fill('mluukkai')
      await page.locator('input').last().fill('salainen')
      // painetaan login nappia
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('fails with wrong credentials', async ({ page }) => {
      // mennään kirjautumis sivulle
      await page.goto('http://localhost:5173/login')
      // täytetään inputit väärin
      await page.locator('input').first().fill('mluukkai')
      await page.locator('input').last().fill('väärä')
      // painetaan login nappia
      await page.getByRole('button', { name: 'login' }).click()
      // tarkistetaan että tulee virheilmoitukset ja että ei lue "Matti Luukkainen logged in'"
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(
        page.getByText('Matti Luukkainen logged in'),
      ).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login')
      await page.locator('input').first().fill('mluukkai')
      await page.locator('input').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      // painetaan new blog nappia
      await page.getByRole('button', { name: 'new blog' }).click()
      // täytetään inputit
      await page.locator('input').nth(0).fill('Testi blogi')
      await page.locator('input').nth(1).fill('Testi Testaaja')
      await page.locator('input').nth(2).fill('http://testi.com')
      // paientaan create nappia
      await page.getByRole('button', { name: 'create' }).click()
      // tarkistetaan että sivulle ilmestyi luodun blogin teksti
      await expect(
        page.getByText('Testi blogi by Testi Testaaja'),
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input').nth(0).fill('Tykkäys blogi')
      await page.locator('input').nth(1).fill('Testaaja')
      await page.locator('input').nth(2).fill('http://testi.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.locator('.success')).toBeVisible()
      // päivitetään sivu jotta luodut varmasti näkyy
      await page.reload()

      const blogLink = page.getByText('Tykkäys blogi by Testaaja')
      await expect(blogLink).toBeVisible()
      await blogLink.click()

      await expect(page.getByText(/0 likes/)).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText(/1 likes/)).toBeVisible()
    })

    test('blog can be deleted by the user who added it', async ({ page }) => {
      // 1. Luodaan blogi
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input').nth(0).fill('Poistettava blogi')
      await page.locator('input').nth(1).fill('Poistaja')
      await page.locator('input').nth(2).fill('http://poisto.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.locator('.success')).toBeVisible()
      // päivitetään sivu jotta luodut varmasti näkyy
      await page.reload()

      const blogLink = page.getByText('Poistettava blogi by Poistaja')
      await expect(blogLink).toBeVisible()
      await blogLink.click()

      await page.reload()

      page.on('dialog', async (dialog) => {
        await dialog.accept()
      })

      const removeButton = page.getByRole('button', { name: 'remove' })
      await expect(removeButton).toBeVisible()
      await removeButton.click()

      await expect(
        page.getByText('Poistettava blogi by Poistaja'),
      ).not.toBeVisible()
    })
  })
})
