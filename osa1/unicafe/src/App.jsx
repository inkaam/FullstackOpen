import { useState } from 'react';

const Button = ({ name, handler }) => {
  return <button onClick={handler}>{name}</button>;
};
const StaticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  if (all === 0) {
    return <p>No feedback given</p>;
  }
  const average = (good * 1 + neutral * 0 + bad * -1) / all;

  const positive = (good / all) * 100 + '%';

  return (
    <div>
      <table>
        <tbody>
          <StaticLine text="good" value={good} />
          <StaticLine text="neutral" value={neutral} />
          <StaticLine text="bad" value={bad} />

          <StaticLine text="all" value={all} />
          <StaticLine text="average" value={average} />
          <StaticLine text="positive" value={positive} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  };
  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };
  const handleBadClick = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <div>
        <h1>Give feedback</h1>
        <Button name="Good" handler={handleGoodClick} />
        <Button name="Neutral" handler={handleNeutralClick} />
        <Button name="Bad" handler={handleBadClick} />
      </div>
      <div>
        <h1>Statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
    </div>
  );
};

export default App;
