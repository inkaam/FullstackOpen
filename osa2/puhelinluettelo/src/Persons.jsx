// Henkilöiden näyttäminen

const Persons = ({ filtered, deletePerson }) => (
  <div>
    {filtered.map((person) => (
      <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => deletePerson(person.name, person.id)}>
          delete
        </button>
      </p>
    ))}
  </div>
);

export default Persons;
