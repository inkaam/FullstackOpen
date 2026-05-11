// src/components/UsersView.jsx
import { useEffect, useState } from 'react'
import userService from '../services/users'
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

const UsersView = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then((data) => setUsers(data))
  }, [])

  return (
    <div>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, mt: 3 }}>
        Users
      </Typography>
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
                <TableCell>{u.name}</TableCell>
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
