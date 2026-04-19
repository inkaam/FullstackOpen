const mongoose = require('mongoose');

// if (process.argv.length < 3) {
//   console.log('give password as argument');
//   process.exit(1);
// }

// const password = process.argv[2];

// const name = process.argv[3];
// const number = process.argv[4];

// const url = `mongodb+srv://im:${password}@cluster.ojpsp.mongodb.net/fullstackopen?retryWrites=true&w=majority&appName=Cluster`;

// mongoose.set('strictQuery', false);
// mongoose.connect(url, { family: 4 });

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });

// const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: name,
  number: number,
});
// aletaan suorittamaan vaan jos argumentteja on 5
// tämän avulla ei tallenneta tietokantaan uusia käyttäjiä myös findilla
if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
//

Person.find({}).then((persons) => {
  console.log('phonebook: ');
  persons.forEach((person) => {
    console.log(`${person.name} ${person.number}`);
  });
  mongoose.connection.close();
});
