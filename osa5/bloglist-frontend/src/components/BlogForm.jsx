import { useState } from 'react'
import { TextField, Button, Typography, Box } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Box sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        create new
      </Typography>
      <form onSubmit={addBlog}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: '500px',
          }}
        >
          <TextField
            label="title"
            variant="outlined"
            size="small"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            label="author"
            variant="outlined"
            size="small"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            label="url"
            variant="outlined"
            size="small"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ width: 'fit-content', mt: 1, backgroundColor: '#daa6da' }}
          >
            CREATE
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default BlogForm
