import { useState } from 'react'
import useBlogStore from '../stores/blogStore'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const { user, likeBlog, removeBlog } = useBlogStore()

  const visibleDeleteButton =
    user && blog.user && blog.user.username === user.username

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title}?`)) {
      removeBlog(blog.id)
    }
  }

  return (
    <div
      className="blog"
      style={{ border: 'solid 1px', marginBottom: 5, padding: 5 }}
    >
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => likeBlog(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
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
