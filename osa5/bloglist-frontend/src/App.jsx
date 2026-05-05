import { useState, useEffect, useRef } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch,
  Navigate,
} from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Box,
  Alert,
  Paper,
  List,
  ListItem,
} from '@mui/material'

import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type }) => {
  if (message === null) return null

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Alert
        severity={type === 'error' ? 'error' : 'success'}
        iconMapping={{ success: <span style={{ color: '#19681d' }}>✔</span> }}
        sx={{
          backgroundColor: '#e8f5e9',
          color: '#59b65e',
          fontSize: '1.1rem',
          border: '1px solid #c8e6c9',
        }}
      >
        {message}
      </Alert>
    </Box>
  )
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
  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

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
      navigate('/')
    } catch {
      setNotification({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setNotification({
        message: `a new blog ${newBlog.title} added`,
        type: 'success',
      })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
      blogFormRef.current.toggleVisibility()
      navigate('/')
    } catch {
      setNotification({ message: 'error adding blog', type: 'error' })
    }
  }

  const handleLike = async (blogToLike) => {
    const updatedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
      user: blogToLike.user.id,
    }
    try {
      const returnedBlog = await blogService.update(blogToLike.id, updatedBlog)
      setBlogs(
        blogs.map((b) =>
          b.id !== blogToLike.id
            ? b
            : { ...blogToLike, likes: returnedBlog.likes },
        ),
      )
    } catch {
      setNotification({ message: 'Error liking blog', type: 'error' })
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        navigate('/')
      } catch {
        setNotification({ message: 'Unauthorized', type: 'error' })
      }
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar position="static" sx={{ backgroundColor: '#daa6da', mb: 3 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: '500' }}>
            Blog App
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{ fontWeight: 'bold' }}
            >
              BLOGS
            </Button>
            {user && (
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={{ fontWeight: 'bold' }}
              >
                NEW BLOG
              </Button>
            )}
            {user ? (
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ fontWeight: 'bold' }}
              >
                LOGOUT
              </Button>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ fontWeight: 'bold' }}
              >
                LOGIN
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Notification message={notification.message} type={notification.type} />

        <Routes>
          <Route
            path="/"
            element={
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                  blogs
                </Typography>
                <List sx={{ mt: 2 }}>
                  {sortedBlogs.map((b) => (
                    <ListItem
                      key={b.id}
                      sx={{
                        display: 'list-item',
                        listStyleType: 'disc',
                        ml: 3,
                      }}
                    >
                      <Link
                        to={`/blogs/${b.id}`}
                        style={{ fontSize: '1.2rem', color: '#581066' }}
                      >
                        {b.title} by {b.author}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Box>
            }
          />

          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blog={blog}
                handleLike={handleLike}
                user={user}
                handleDelete={handleDelete}
              />
            }
          />

          <Route
            path="/create"
            element={
              user ? (
                <BlogForm createBlog={handleCreateBlog} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/login"
            element={
              <Box sx={{ mt: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
                  Log in to application
                </Typography>
                <form onSubmit={handleLogin}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '300px',
                      gap: 3,
                    }}
                  >
                    <TextField
                      label="username"
                      variant="standard"
                      value={username}
                      onChange={({ target }) => setUsername(target.value)}
                    />
                    <TextField
                      label="password"
                      type="password"
                      variant="standard"
                      value={password}
                      onChange={({ target }) => setPassword(target.value)}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        width: 'fit-content',
                        mt: 2,
                        backgroundColor: '#daa6da',
                      }}
                    >
                      LOGIN
                    </Button>
                  </Box>
                </form>
              </Box>
            }
          />
        </Routes>
      </Container>
    </Container>
  )
}

export default App
