const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

// funktioiden tekemistä varten
const blogs = [
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
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((biggest, current) => {
    return current.likes > biggest.likes ? current : biggest; // jos tarkasteltava on suurempi kuin sen hetken suurin, palautetaan tarkasteltava, muutoin sen hetken suurin
  });
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const blogsPerAuthor = _.countBy(blogs, 'author');
  const resultArray = _.map(blogsPerAuthor, (blogsCount, authorName) => ({
    author: authorName,
    blogs: blogsCount,
  }));
  return _.maxBy(resultArray, 'blogs');
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  // ryhmitellään blogit author perusteella
  const groupedAuthors = _.groupBy(blogs, 'author');

  // mapataan näyttämään author: nimi likes: likejen summa kaikista
  const authorsLikes = _.map(groupedAuthors, (authorBlogs, authorName) => {
    return {
      author: authorName,
      likes: _.sumBy(authorBlogs, 'likes'),
    };
  });
  // console.log(groupedAuthors);
  // console.log(authorsLikes);

  // palautetaan authorsLikes se itemi, jonka likes on suurin
  return _.maxBy(authorsLikes, 'likes');
};

// mostLikes(blogs);
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
