import { useParams } from 'react-router-dom'
import { Typography, List, ListItem, ListItemText } from '@mui/material'

const UserDetails = ({ users }) => {
  const id = useParams().id
  const user = users.find((u) => u.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <Typography variant="h4" sx={{ my: 2 }}>
        {user.name}
      </Typography>
      <Typography variant="h6">added blogs</Typography>
      <ul>
        {user.blogs.map((blog) => (
          <List
            key={blog.id}
            sx={{
              py: 0.5,
              px: 0,
              display: 'list-item',
              listStyleType: 'disc',
              ml: 3,
            }}
          >
            <ListItemText primary={blog.title} />
          </List>
        ))}
      </ul>
    </div>
  )
}

export default UserDetails
