const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()

const jwt = require('jsonwebtoken')

// tokenin saaminen
// const getTokenFrom = (request) => {
//   const authorization = request.get('authorization');
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '');
//   }
//   return null;
// };

// hakeminen
blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    })
    response.json(blogs)
  } catch (exception) {
    next(exception)
  }
})

// uuden lisääminen
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0, // jos ei asetete lieks kohtaa, se on suoraa 0
    user: user._id,
  })

  try {
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()

    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

// poisto
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({
        error: 'only the creator can delete this blog',
      })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

// olemassa olevan muokkaaminen
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      returnDocument: 'after', // new: true -> returnDocument: 'after' koska "arning: mongoose: the `new` option for `findOneAndUpdate()` and `findOneAndReplace()` is deprecated. Use `returnDocument: 'after'` instead."
    })

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

// kommentointi
blogsRouter.post('/:id/comments', async (request, response, next) => {
  const { content } = request.body

  if (!content) {
    return response.status(400).json({ error: 'comment content missing' })
  }

  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    blog.comments = blog.comments.concat(content)
    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})
module.exports = blogsRouter
