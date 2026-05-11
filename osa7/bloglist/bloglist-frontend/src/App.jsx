import { useState, useEffect } from 'react'
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

import UsersView from './components/UserView'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import Togglable from './components/Togglable'
import ErrorBoundary from './components/ErrorBoundary'
import loginService from './services/login'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'

const Notification = () => {
  const { message, type } = useNotificationStore()
  if (!message) return null

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Alert severity={type === 'error' ? 'error' : 'success'}>{message}</Alert>
    </Box>
  )
}

const App = () => {
  // tila ja toiminnot storesta
  const { blogs, user, initializeBlogs, setUser, clearUser } = useBlogStore()

  // kirjautumisen paikalliset tilat
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const setNotification = useNotificationStore((state) => state.setNotification)
  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  // blogien alustaminen palvelimelta sovellusken käynnistyessä
  useEffect(() => {
    initializeBlogs()
  }, [])

  // tarkistus löytyykö paikallisesti muistissa oleva kirjautunut käyttäjä
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser),
      )
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    clearUser()
    navigate('/')
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
            <Button
              color="inherit"
              component={Link}
              to="/users"
              sx={{ fontWeight: 'bold' }}
            >
              USERS
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
        <Notification />
        <ErrorBoundary>
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

            <Route path="/users" element={<UsersView />} />
            <Route path="/blogs/:id" element={<BlogView blog={blog} />} />

            <Route
              path="/create"
              element={user ? <BlogForm /> : <Navigate to="/login" />}
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
            <Route
              path="*"
              element={
                <Box sx={{ mt: 4 }}>
                  <Typography>404 – Page not found</Typography>
                </Box>
              }
            />
          </Routes>
        </ErrorBoundary>
      </Container>
    </Container>
  )
}

export default App
