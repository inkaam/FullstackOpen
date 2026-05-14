// import { useState } from 'react'
import { TextField, Button, Typography, Box, Divider } from '@mui/material'
import useBlogStore from '../stores/blogStore'
import useNotificationStore from '../stores/notificationStore'
import { useField } from '../hooks'

const BlogForm = () => {
  const { createBlog } = useBlogStore()
  const setNotification = useNotificationStore((s) => s.setNotification)
  // const [title, setTitle] = useState('')
  // const [author, setAuthor] = useState('')
  // const [url, setUrl] = useState('')
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      await createBlog({
        title: title.value,
        author: author.value,
        url: url.value,
      })
      setNotification(`a new blog ${title.value} added`, 'success')

      title.reset()
      author.reset()
      url.reset()
    } catch {
      setNotification('failed to add blog', 'error')
    }
  }

  return (
    <Box sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
        Create new blog
      </Typography>
      <Divider sx={{ mb: 5 }} />
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
            value={title.value}
            onChange={title.onChange}
          />
          <TextField
            label="author"
            variant="outlined"
            size="small"
            value={author.value}
            onChange={author.onChange}
          />
          <TextField
            label="url"
            variant="outlined"
            size="small"
            value={url.value}
            onChange={url.onChange}
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
