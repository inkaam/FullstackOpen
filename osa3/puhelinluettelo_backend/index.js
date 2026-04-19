require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
// person  skeema
const Person = require('./models/person');

const app = express();

// Middleware json-parser, käsittelee request- ja response -olioita, parsii raakadataa JS-olioiksi bodyyn
app.use(express.json());

app.use(express.static('dist'));

morgan.token('posteddata', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : '';
});

app.use(
  morgan(
    ':method :url :status :res[content-length] :response-time ms :posteddata',
  ),
);

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>');
});

// get all
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// get info
app.get('/info', (request, response) => {
  Person.find({}).then((allPersons) => {
    const personCount = allPersons.length;
    const timeStamp = new Date();
    response.send(
      `Phonebok has info for ${personCount} people <br/> ${timeStamp}`,
    );
  });
});

// get by id
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});


app.post('/api/persons', (request, response) => {
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
    .catch((error) => {
      console.log(error);
      response.status(400).json({ error: error.message });
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
