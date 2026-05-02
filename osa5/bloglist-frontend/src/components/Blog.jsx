import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const visibleDeleteButton = blog.user && blog.user.username === user.username
  const handleLike = () => {
    updateBlog(blog)
  }
  const handleDelete = () => {
    deleteBlog(blog)
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const label = visible ? 'hide' : 'view'

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{label}</button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user && blog.user.name}</div>

          {visibleDeleteButton && (
            <button
              style={{ backgroundColor: 'red', color: 'white' }}
              onClick={handleDelete}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
