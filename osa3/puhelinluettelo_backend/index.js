const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
// Middleware json-parser, käsittelee request- ja response -olioita, parsii raakadataa JS-olioiksi bodyyn
app.use(express.json());

// app.use(morgan('tiny'));

morgan.token('posteddata', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : '';
});

app.use(
  morgan(
    ':method :url :status :res[content-length] :response-time ms :posteddata'
  )
);
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },

  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },

  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },

  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const personCount = persons.length;
  const timeStamp = new Date();

  response.send(
    `Phonebok has info for ${personCount} people <br/> ${timeStamp}`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id); // id meni string muotoon, eikä find löytänyt id:tä, joten laitoin Number()
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
