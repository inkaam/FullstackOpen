import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  const blog = {
    title: 'Component testing',
    author: 'Test Author',
    url: 'www.test.com',
    likes: 102,
    user: {
      username: 'testi',
      name: 'Test User',
    },
  }

  const user = {
    username: 'testi',
  }

  test('renders title and author and doesnt render url or likes by default', () => {
    render(<Blog blog={blog} user={user} />)

    // löytyykö title ja author
    const element = screen.getByText('Component testing', { exact: false })
    expect(element).toBeDefined()

    // no url
    const url = screen.queryByText('www.test.com')
    expect(url).toBeNull()

    // no likes
    const likes = screen.queryByText('likes 102')
    expect(likes).toBeNull()
  })

  test('renders url and likes when the view button clicked', async () => {
    render(<Blog blog={blog} user={user} />)

    const session = userEvent.setup()
    const button = screen.getByText('view')
    await session.click(button)

    // klikkauksen jälkeen löytyy:
    // url
    expect(screen.getByText('www.test.com')).toBeDefined()
    // likes
    expect(screen.getByText('likes 102', { exact: false })).toBeDefined()
    // user
    expect(screen.getByText('Test User')).toBeDefined()
  })

  test('clicking like button two times calls event handler twice', async () => {
    const mockHandler = vi.fn()
    render(<Blog blog={blog} user={user} updateBlog={mockHandler} />)

    const session = userEvent.setup()

    const viewButton = screen.getByText('view')

    await session.click(viewButton)

    const likeButton = screen.getByText('like')

    await session.click(likeButton)
    await session.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
