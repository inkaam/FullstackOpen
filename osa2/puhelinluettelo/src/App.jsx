import { useState, useEffect } from 'react';
import personService from './services/personService';
import PersonForm from './PersonForm';
import Persons from './Persons';
import Filter from './Filter';

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={type}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  // datan hakeminen
  useEffect(() => {
    console.log('effect');
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  console.log('render', persons.length, 'persons');

  // handlers
  const handleNameChange = (event) => {
    console.log('handleNameChange:' + event.target.value);
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    console.log('handleNumberChange:' + event.target.value);
    setNewNumber(event.target.value);
  };
  const handleFilterChange = (event) => {
    console.log('handleFilterChange:' + event.target.value);
    setNewFilter(event.target.value);
  };

  // persons filtteröiti
  const filtered = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  // henkilön lisääinen
  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const alreadyAddedPerson = persons.find(
      (person) => person.name === newName
    );

    if (alreadyAddedPerson && alreadyAddedPerson.number !== newNumber) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(alreadyAddedPerson.id, personObject)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                // jos id ei ole sama, id pysyy sellaisenaan
                // jos id on sama, korvataan vanha person päivitetyllä eprsonilla
                person.id !== alreadyAddedPerson.id ? person : updatedPerson
              )
            );
            setNewName('');
            setNewNumber('');
            setNotification({
              message: `Edited ${updatedPerson.name}s number to ${newNumber}`,
              type: 'success',
            }),
              setTimeout(() => {
                setNotification({ message: null, type: null });
              }, 3000);
          })
          .catch((error) => {
            setNotification({
              message: `Information of ${alreadyAddedPerson.name} has already been removed from server`,
              type: 'error',
            }),
              setTimeout(() => {
                setNotification({ message: null, type: null });
              }, 3000);

            console.log(
              `Information of ${alreadyAddedPerson.name} has already been removed from server`,
              error
            );
          });
      }
    } else if (alreadyAddedPerson) {
      alert(`${newNumber} is already added to phonebook`);
    } else {
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setNotification({
            message: `Added ${returnedPerson.name}`,
            type: 'success',
          }),
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 3000);
        })
        .catch((error) => {
          setNotification({
            message: `Error adding ${personObject.name}`,
            type: 'error',
          });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 3000);
          console.log(`Error adding ${personObject.name}`, error);
        });
    }
  };

  const deletePerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          setNotification({
            message: `Information of ${name} has already been removed from server`,
            type: 'error',
          }),
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 3000);

          console.log(
            `Information of ${name} has already been removed from server`,
            error
          );
        });
      setNotification({
        message: `Deleted ${deletePerson.name}`,
        type: 'success',
      }),
        setTimeout(() => {
          setNotification({ message: null, type: null });
        }, 3000);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons filtered={filtered} deletePerson={deletePerson} />
      {/* <div>debug newName: {newName}</div>
      <div>debug newFilter: {newFilter}</div> */}
    </div>
  );
};
export default App;
