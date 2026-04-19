require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

app.use(express.static('dist'));
app.use(express.json());

morgan.token('posteddata', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : '';
});

app.use(
  morgan(
    ':method :url :status :res[content-length] :response-time ms :posteddata',
  ),
);

// GET

// get all persons
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

// get info
app.get('/info', (request, response, next) => {
  Person.find({})
    .then((allPersons) => {
      const personCount = allPersons.length;
      const timeStamp = new Date();
      response.send(
        `Phonebook has info for ${personCount} people <br/> ${timeStamp}`,
      );
    })
    .catch((error) => next(error));
});

// get person by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// PUT

// edit number
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;
  const person = {
    name: name,
    number: number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true }) // new true palauttaa päivitetyn olion
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// DELETE

// delete person by id
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// POST

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' });
  }

  const person = new Person({ name: body.name, number: body.number });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

// virheidenkäsitttely middleware

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
