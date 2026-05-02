const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const assert = require('node:assert');

const Blog = require('../models/blog');

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

describe('getting blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test('a specific blog title is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');
    const titles = response.body.map((e) => e.title);
    assert.ok(titles.includes('React patterns'));
  });

  // 4.9
  test('blogs have id instead of _id', async () => {
    const response = await api.get('/api/blogs');
    // haetaan vaikka ensimmäinen item listasta
    const firstBlog = response.body[0];
    assert.ok(firstBlog.id);
    assert.deepStrictEqual(firstBlog._id, undefined); // tarkistaa ettei _id kenttää löydy
  });
});

describe('addition of a blog', () => {
  // 4.10
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Testi Author',
      url: 'http://testiurl.com',
      likes: 20,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map((r) => r.title);
    assert.deepStrictEqual(response.body.length, initialBlogs.length + 1);
    assert.ok(titles.includes('async/await simplifies making async calls'));
  });

  // 4.11
  test('when post blog without likes set likes to zero', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Testi Author',
      url: 'http://testiurl.com',
    };
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  // 4.12
  test('dont add blog wihtout title', async () => {
    const newBlog = {
      author: 'Testi Author',
      url: 'http://testiurl.com',
      likes: 12,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
  test('dont add blog wihtout url', async () => {
    const newBlog = {
      author: 'Testi Author',
      title: 'async/await simplifies making async calls',
      likes: 12,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

describe('deletion of a blog', () => {
  test('a blog can be deleted', async () => {
    const getBlogsAtStart = await api.get('/api/blogs');
    const blogsAtStart = getBlogsAtStart.body;
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const getBlogsAtEnd = await api.get('/api/blogs');
    const blogsAtEnd = getBlogsAtEnd.body;

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    const titles = blogsAtEnd.map((r) => r.title);
    assert.ok(!titles.includes(blogToDelete.title));
  });
});

describe('edition of a blog', () => {
  test('blog likes can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    const blogToUpdate = blogsAtStart.body[0];

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);
  });
});
// katkaisee yhteyden
after(async () => {
  await mongoose.connection.close();
});
