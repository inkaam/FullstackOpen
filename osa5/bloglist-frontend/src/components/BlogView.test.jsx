import { render, screen } from '@testing-library/react'
import BlogView from './BlogView'

describe('BlogView component testing', () => {
  const blog = {
    title: 'Vitest test',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 12,
    user: {
      username: 'creator',
      name: 'Creator',
    },
  }

  const handleLike = vi.fn()
  const handleDelete = vi.fn()

  test('unauthenticated user sees blog details but no buttons', () => {
    render(
      <BlogView
        blog={blog}
        handleLike={handleLike}
        handleDelete={handleDelete}
        user={null}
      />,
    )

    // perustieetojen tarkastus
    expect(screen.getByText('Vitest test by Test Author')).toBeDefined()
    expect(screen.getByText('http://test.com')).toBeDefined()
    expect(screen.getByText('12 likes', { exact: false })).toBeDefined()

    // tarkistus ettei nappeja löydy
    expect(screen.queryByText('like')).toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('logged in user who is not creator sees only like button', () => {
    const regularUser = { username: 'other', name: 'Other' }

    render(
      <BlogView
        blog={blog}
        handleLike={handleLike}
        handleDelete={handleDelete}
        user={regularUser}
      />,
    )

    // tarkistus että like nappi löytyy
    expect(screen.getByText('like')).toBeDefined()

    // tarkistus ettei remove nappia ole
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('creator sees both like and remove buttons', () => {
    const creatorUser = { username: 'creator', name: 'Creator' }

    render(
      <BlogView
        blog={blog}
        handleLike={handleLike}
        handleDelete={handleDelete}
        user={creatorUser}
      />,
    )

    // tarkistus että molemmat napit löytyy
    expect(screen.getByText('like')).toBeDefined()
    expect(screen.getByText('remove')).toBeDefined()
  })
})
