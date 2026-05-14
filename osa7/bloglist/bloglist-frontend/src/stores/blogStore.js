import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set, get) => ({
  blogs: [],
  user: null,

  // 7.12
  initializeBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },
  createBlog: async (blogObject) => {
    const newBlog = await blogService.create(blogObject)
    set({ blogs: get().blogs.concat(newBlog) })
  },
  //7.19
  commentBlog: async (id, content) => {
    const updatedBlog = await blogService.addComment(id, content)
    set({
      blogs: get().blogs.map((b) => (b.id === id ? updatedBlog : b)),
    })
  },
  // 7.13
  likeBlog: async (blog) => {
    const updated = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const returned = await blogService.update(blog.id, updated)
    set({
      blogs: get().blogs.map((b) =>
        b.id !== blog.id ? b : { ...blog, likes: returned.likes },
      ),
    })
  },
  removeBlog: async (id) => {
    await blogService.remove(id)
    set({ blogs: get().blogs.filter((b) => b.id !== id) })
  },

  // 7.14
  setUser: (user) => {
    if (user) blogService.setToken(user.token)
    set({ user })
  },
  clearUser: () => {
    window.localStorage.removeItem('loggedBlogappUser')
    set({ user: null })
  },
}))

export default useBlogStore
