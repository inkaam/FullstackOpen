import { useEffect, useState } from 'react'
import userService from '../services/users'
import { Link } from 'react-router-dom'
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material'

const UsersView = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then((data) => setUsers(data))
  }, [])

  return (
    <div>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
        Users
      </Typography>
      <Divider sx={{ mb: 5 }} />
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Username
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Blogs created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Link to={`/users/${u.id}`}>{u.name}</Link>
                </TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UsersView
