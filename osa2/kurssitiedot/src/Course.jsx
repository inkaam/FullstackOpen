const Course = ({ course }) => {
  return (
    // Näyttää Header alikomponentin ja Content alikomponentin sisällön
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </div>
  );
};

const Header = ({ name }) => {
  return <h2>{name}</h2>;
};

const Content = ({ parts }) => {
  // lasketaan kurssin tehtävien määrä yhteensä Reducen avulla
  const allExercises = parts.reduce((sum, part) => {
    console.log(sum, part);
    return sum + part.exercises;
  }, 0);

  return (
    // käytetään mappia näyttämään jokaisen kurssin osion tiedot (Part: nimi ja tehtävien määrä)
    <div>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
      <p>
        total of <strong>{allExercises} exercises</strong>
      </p>
    </div>
  );
};

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  );
};

// exportataan Course
export default Course;
