import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('Blog Form', () => {
  test('calls createBlog with right details when new blog is created', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const sendButton = screen.getByText('create')

    // asetetaan inputit
    await user.type(inputs[0], 'otsikko')
    await user.type(inputs[1], 'kirjoittaja')
    await user.type(inputs[2], 'www.testi.com')

    // lomakkeen lähetys
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    const submittedBlog = createBlog.mock.calls[0][0]
    expect(submittedBlog.title).toBe('otsikko')
    expect(submittedBlog.author).toBe('kirjoittaja')
    expect(submittedBlog.url).toBe('www.testi.com')
  })
})
