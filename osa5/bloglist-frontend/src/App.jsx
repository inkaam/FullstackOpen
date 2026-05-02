import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type }) => {
  if (message === null) return null
  return <div className={type}>{message}</div>
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  })

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
      } catch (exception) {
        console.log(exception.response.data)
        setNotification({
          message: 'Unauthorized: perhaps the token expired',
          type: 'error',
        })
      }
    }
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()

      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))

      setNotification({
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        type: 'success',
      })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    } catch {
      setNotification({ message: 'error adding blog', type: 'error' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(
        blogs.map((b) =>
          b.id !== blog.id ? b : { ...blog, likes: returnedBlog.likes },
        ),
      )
    } catch {
      setNotification({ message: 'Error liking blog', type: 'error' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>
            username{' '}
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password{' '}
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>

      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={handleLike}
          deleteBlog={handleDelete}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
