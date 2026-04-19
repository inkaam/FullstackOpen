require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
// person  skeema
const Person = require('./models/person');

const app = express();

// Middleware json-parser, käsittelee request- ja response -olioita, parsii raakadataa JS-olioiksi bodyyn
app.use(express.json());

app.use(express.static('dist'));


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


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

// id:n generointi omana finktioa, jota kutsutaan app.post
const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  return maxId + 1;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;
  console.log(body);
  // jos nimi tai numero puuttuu, annetaan error koodi 400 ja asiaankuuluva error viesti
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    });
  }

  // jos nimi on jo olemassa, annetaan error koodi 400 ja asiaankuuluva error viesti
  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: 'name has to be unique',
    });
  }

  // uusi henkilö
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  // muokkaa persons lisäämällä siihen henkilön, jossa request.bodyn tiedot ja generoitu ID
  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
