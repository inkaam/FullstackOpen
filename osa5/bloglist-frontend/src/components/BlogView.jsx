import { Box, Typography, Button, Link as MuiLink } from '@mui/material'

const BlogView = ({ blog, handleLike, user, handleDelete }) => {
  if (!blog) return null

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
          onClick={() => handleLike(blog)}
          sx={{ borderColor: '#2196f3', color: '#2196f3', fontWeight: 'bold' }}
        >
          LIKE
        </Button>

        {user && blog.user && user.username === blog.user.username && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(blog)}
            sx={{ fontWeight: 'bold' }}
          >
            REMOVE
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default BlogView
