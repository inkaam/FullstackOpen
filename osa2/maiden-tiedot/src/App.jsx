import { useState, useEffect } from 'react';
import axios from 'axios';

// näyttää listan maata haettaessa
const SearchedCountries = ({ countries, onShow }) => {
  if (countries.length > 10) {
    // jos yli 10
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    // jos yli 1 (ja ei yli 10)
    return (
      <ul>
        {countries.map((country) => (
          <li key={country.name.common}>
            {country.name.common}{' '}
            <button onClick={() => onShow(country)}>Show</button>
          </li>
        ))}
      </ul>
    );
  } else if (countries.length === 1) {
    // jos 1
    const country = countries[0]; // country muuttujaan asetetaan countries taulukon 0 indeksissä oleva maa (löydetty ainut maa)
    return <CountryInfo country={country} />;
  } else {
    return <p>No matches found</p>;
  }
};

// näyttää haetun maan tiedot
const CountryInfo = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`${country.flags.alt}`} />
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]); // maat apista
  const [value, setValue] = useState(''); // filter
  const [shownCountry, setShownCountry] = useState(null);

  // kaikkien maiden haku (kun komponentti ladataan)
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching country:', error);
      });
  }, []);

  // Filtteröinti/haku inputin arvon perusteella
  const searchedCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(value.toLowerCase())
  );

  const handleChange = (event) => {
    setValue(event.target.value);
    setShownCountry(null);
  };
  const handleShowChange = (country) => {
    setShownCountry(country);
  };

  let content;
  if (shownCountry) {
    content = <CountryInfo country={shownCountry} />;
  } else {
    content = (
      <SearchedCountries
        countries={searchedCountries}
        onShow={handleShowChange}
      />
    );
  }
  return (
    <div>
      <div>
        find countries
        <input value={value} onChange={handleChange} />
      </div>
      {content}
    </div>
  );
};

export default App;
