import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Link as MuiLink,
  List,
  ListItem,
  TextField,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useBlogStore from '../stores/blogStore'
import useNotificationStore from '../stores/notificationStore'

const BlogView = ({ blog }) => {
  const [comment, setComment] = useState('')
  const { user, likeBlog, removeBlog, commentBlog } = useBlogStore() // Hae storesta
  const setNotification = useNotificationStore((s) => s.setNotification)
  const navigate = useNavigate()

  if (!blog) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography>404 – Page not found</Typography>
      </Box>
    )
  }
  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title}?`)) {
      await removeBlog(blog.id)
      navigate('/')
      setNotification(`Removed ${blog.title}`, 'success')
    }
  }
  const handleComment = async (event) => {
    event.preventDefault()
    if (!comment.trim()) return

    try {
      await commentBlog(blog.id, comment)
      setComment('')
      setNotification('Comment added!', 'success')
    } catch {
      setNotification('Failed to add comment', 'error')
    }
  }
  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        border: '1px solid #ddd',
        borderRadius: '4px',
        maxWidth: '800px',
      }}
    >
      <Typography variant="h3" component="h2" sx={{ fontWeight: '500', mb: 1 }}>
        {blog.title}
      </Typography>

      <Typography variant="h5" sx={{ color: '#555', mb: 1 }}>
        by {blog.author}
      </Typography>

      <MuiLink
        href={blog.url}
        target="_blank"
        rel="noopener"
        sx={{ fontSize: '1.1rem', display: 'block', mb: 1 }}
      >
        {blog.url}
      </MuiLink>

      <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
        Added by {blog.user ? blog.user.name : 'unknown'}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6">{blog.likes} likes</Typography>

        <Button
          variant="outlined"
          onClick={() => likeBlog(blog)}
          sx={{
            borderColor: '#ff32dd',
            color: '#f13cd3',
            fontWeight: '800',
          }}
        >
          LIKE
        </Button>

        {user?.username === blog.user?.username && (
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: '#d32424',
              color: 'white',
              fontWeight: '800',
            }}
          >
            REMOVE
          </Button>
        )}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          comments
        </Typography>
        <Box
          component="form"
          onSubmit={handleComment}
          sx={{ display: 'flex', gap: 1, mb: 3 }}
        >
          <TextField
            size="small"
            placeholder="add a comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            sx={{ flexGrow: 1, maxWidth: '300px' }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: '#d887ca', fontWeight: '800' }}
          >
            ADD COMMENT
          </Button>
        </Box>
        {!blog.comments || blog.comments.length === 0 ? (
          <Typography sx={{ color: '#888', fontStyle: 'italic' }}>
            no comments yet...
          </Typography>
        ) : (
          <List>
            {blog.comments.map((comment, index) => (
              <ListItem
                key={index}
                sx={{
                  py: 0.5,
                  px: 0,
                  display: 'list-item',
                  listStyleType: 'disc',
                  ml: 3,
                }}
              >
                <Typography variant="body1">{comment}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  )
}

export default BlogView
