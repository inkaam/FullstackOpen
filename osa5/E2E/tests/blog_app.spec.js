const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // tyhjennys
    await request.post('http://127.0.0.1:3003/api/testing/reset')
    // käyttäjän luonti
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Log in to application')
    // oletetaan että näkyvissä
    await expect(locator).toBeVisible()
    // username field näkyvissä
    await expect(page.getByText('username')).toBeVisible()
    // password field näkyvissä
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // täytetään input fieldit oikein
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      //painetaan login nappia
      await page.getByRole('button', { name: 'login' }).click()
      // kirjautuminen onnistui kun näkyy teksti Matti Luukkainen logged in
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      // täytetään input fieldit, josita salasana väärin
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('väärä')
      //painetaan login nappia
      await page.getByRole('button', { name: 'login' }).click()

      // katsotaan että tulee error
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')

      // kirjautuminen epäonnistui kun ei näy teksti Matti Luukkainen logged in
      await expect(
        page.getByText('Matti Luukkainen logged in'),
      ).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    // luodaan toinen käyttäjä ja kirjaudutaan sisään ensimmäisellä
    beforeEach(async ({ page, request }) => {
      // luodaan toinen käyttäjä testejä varten
      await request.post('http://127.0.0.1:3003/api/users', {
        data: {
          name: 'Toinen Käyttäjä',
          username: 'toinen',
          password: 'toinensalainen',
        },
      })

      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      // varmistetaan että kirjautuminen onnistui
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      // painetaan new blog nappia
      await page.getByRole('button', { name: 'new blog' }).click()

      // täytetään lomakkeen fieldit
      await page.getByLabel('title:').fill('Testi blogi')
      await page.getByLabel('author:').fill('Testi Testaaja')
      await page.getByLabel('url:').fill('http://testi.com')

      // painetaan create nappia
      await page.getByRole('button', { name: 'create' }).click()

      // varmistetaan että blogi on lisätty
      await expect(page.getByText('Testi blogi Testi Testaaja')).toBeVisible()

      // varmistetaan myös että tulee success ilmoitus
      const successDiv = page.locator('.success')
      await expect(successDiv).toContainText(
        'a new blog Testi blogi by Testi Testaaja added',
      )
    })

    test('a blog can be liked', async ({ page }) => {
      // tehdään blogi jota tykätään (jotta testi on itsenäinen)
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByLabel('title:').fill('Like blogi')
      await page.getByLabel('author:').fill('Testi Author')
      await page.getByLabel('url:').fill('http://testi.com')
      await page.getByRole('button', { name: 'create' }).click()

      // etsitään juuri luotu blogi nimen perusteella
      const blogElement = page
        .locator('.blog')
        .filter({ hasText: 'Like blogi' })

      // painetaan view nappia niin nähdään kaikki tiedot
      await blogElement.getByRole('button', { name: 'view' }).click()

      // tarkistus että tykkäyksiä on 0
      await expect(blogElement.getByText('likes 0')).toBeVisible()

      // painetaan like nappia
      await blogElement.getByRole('button', { name: 'like' }).click()

      // tarkistus että tykkäyksien määrä on 1
      await expect(blogElement.getByText('likes 1')).toBeVisible()
    })

    test('blog can be deleted by the user who added it', async ({ page }) => {
      // tehdään blogi mikä poistetaan
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByLabel('title:').fill('Poisto blogi')
      await page.getByLabel('author:').fill('Testi Poistaja')
      await page.getByLabel('url:').fill('http://testi.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.reload()

      // etsitään yllä luotu blogi
      const blogElement = page
        .locator('.blog')
        .filter({ hasText: 'Poisto blogi' })
      await blogElement.getByRole('button', { name: 'view' }).click()

      // määritellään valmiiksi dialog tapahtuman käsittely niin että se hyväksytään
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toContain('Remove blog Poisto blogi?')
        await dialog.accept()
      })

      // painetaan remove nappia
      await blogElement.getByRole('button', { name: 'remove' }).click()

      // tarkistus ettei poistettu blogi ole enää listassa
      await expect(
        page.getByText('Poisto blogi Testi Poistaja'),
      ).not.toBeVisible()
    })
    test('only the creator can see the delete button of a blog', async ({
      page,
    }) => {
      // tehdään blogi
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByLabel('title:').fill('creator mluukkai')
      await page.getByLabel('author:').fill('mluukkai')
      await page.getByLabel('url:').fill('http://testi.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.reload()

      // tarkistus että blogin tekijä vain näkee remove napin
      const blogElement = page
        .locator('.blog')
        .filter({ hasText: 'creator mluukkai' })
      await blogElement.getByRole('button', { name: 'view' }).click()
      await expect(
        blogElement.getByRole('button', { name: 'remove' }),
      ).toBeVisible()

      // kirjaudutaan ulos ja sisään toisella käyttäjällä
      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByLabel('username').fill('toinen')
      await page.getByLabel('password').fill('toinensalainen')
      await page.getByRole('button', { name: 'login' }).click()

      // tarkistus ettei remove nappia näy
      const blogElementForOther = page
        .locator('.blog')
        .filter({ hasText: 'creator mluukkai' })
      await blogElementForOther.getByRole('button', { name: 'view' }).click()

      // tarkistus ettei nappia ole DOMissa tai se ei ole näkyvissä
      await expect(
        blogElementForOther.getByRole('button', { name: 'remove' }),
      ).not.toBeVisible()
    })

    test('blogs sorted by likes in descending order', async ({ page }) => {
      // tehdään kolme blogia
      const blogData = [
        { title: 'vähiten tykätty', author: 'author1', url: 'www.testi.com' },
        { title: 'eniten tykätty', author: 'author2', url: 'www.testi.com' },
        { title: 'keskitasoa', author: 'author3', url: 'www.testi.com' },
      ]

      for (const blog of blogData) {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByLabel('title:').fill(blog.title)
        await page.getByLabel('author:').fill(blog.author)
        await page.getByLabel('url:').fill(blog.url)
        await page.getByRole('button', { name: 'create' }).click()

        await page.getByText(`${blog.title} ${blog.author}`).waitFor()
      }

      // annetaan blogille 2 tykkäystä
      const mostLiked = page
        .locator('.blog')
        .filter({ hasText: 'eniten tykätty' })
      await mostLiked.getByRole('button', { name: 'view' }).click()
      await mostLiked.getByRole('button', { name: 'like' }).click()
      await expect(mostLiked.getByText('likes 1')).toBeVisible()
      await mostLiked.getByRole('button', { name: 'like' }).click()
      await expect(mostLiked.getByText('likes 2')).toBeVisible()

      // annetaan blogille 1 tykkäys
      const mediumLiked = page
        .locator('.blog')
        .filter({ hasText: 'keskitasoa' })
      await mediumLiked.getByRole('button', { name: 'view' }).click()
      await mediumLiked.getByRole('button', { name: 'like' }).click()
      await expect(mediumLiked.getByText('likes 1')).toBeVisible()

      // tarkistetaan lopullinen järjestys domissa
      const blogLocators = page.locator('.blog')

      // indeksissä 0
      await expect(blogLocators.nth(0)).toContainText('eniten tykätty')

      // indeksissä 1
      await expect(blogLocators.nth(1)).toContainText('keskitasoa')

      // indeksissä 2
      await expect(blogLocators.nth(2)).toContainText('vähiten tykätty')
    })
  })
})
