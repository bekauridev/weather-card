import { useEffect, useState } from "react";

export default function App() {
  //
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useState(function () {
    async function cityCall(latitude, longitude) {
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (!res.ok) throw new Error("Current location not found");
        const data = await res.json();
        setSearch(data.city);
      } catch (err) {
        setError(err.message);
      }
    }

    const options = {
      enableHighAccuracy: true,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        cityCall(latitude, longitude);
      },
      (error) => {
        setError(`
        Unable to fetch your location, but the app is still fully functional. Explore freely!`);
      },
      options
    );
  }, []);

  return (
    <div className="App">
      <Title />
      <Search search={search} onSetSearch={setSearch} />
      <WeatherData search={search} />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

function Title() {
  return <h1 className="App__title">Weather in</h1>;
}

function Search({ search, onSetSearch }) {
  return (
    <input
      className="App__input"
      aria-label="Search"
      type="text"
      required
      value={search}
      onChange={(e) => onSetSearch(e.target.value)}
    />
  );
}

function Loader() {
  return <div className="Loader"></div>;
}
function ErrorMessage({ message }) {
  return <p className="Error">{message}</p>;
}

function WeatherData({ search }) {
  const [weatherData, setWeatherData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      const trimmedSearch = search.trim();
      async function weatherCall() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=d0eeec8698b84bba80c184012241001&q=${trimmedSearch}&aqi=no`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error("Not found");
          const data = await res.json();
          setWeatherData(data);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (trimmedSearch.length < 3) {
        setError("Please enter a valid city or country name !");
        return;
      }
      weatherCall();

      return function () {
        controller.abort();
      };
    },
    [search]
  );

  return (
    <div className="weather">
      {isLoading && <Loader />}
      {!isLoading && !error && weatherData && <Weather data={weatherData} />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

function Weather({ data }) {
  const {
    location: { country, name: city },
    current: {
      condition: { text: weatherCondition, icon },
      temp_c: celsius,
      temp_f: fahrenheit,
      wind_kph,
      wind_mph,
    },
  } = data;

  useEffect(
    function () {
      if (!city) return;
      document.title = `Weather in | ${city}`;

      return function () {
        document.title = "Weather App";
      };
    },
    [city]
  );

  return (
    <div className="weather__card">
      <p className="weather__country default-font-style">{country}</p>
      <p className="weather__city">
        {weatherCondition}&#160;
        {city}
      </p>
      <svg
        className="weather__icon"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        width="50px"
        height="50px"
        viewBox="0 0 100 100"
      >
        <image width="100" height="100" x="0" y="0" href={icon}></image>
      </svg>
      <p className="weather__temp">{celsius}°</p>
      <p className="weather__wind default-font-style">wind</p>
      <div className="weather-wind-container">
        <div className="weather-wind-container-min">
          <p className="weather-wind-container-min__minHeading">KPH</p>
          <p className="weather-wind-container-max__minTemp">{wind_kph}</p>
        </div>
        <div className="weather-wind-container-max">
          <p className=" weather-wind-container-min__maxHeading">MPH</p>
          <p className="weather-wind-container-max__maxTemp">{wind_mph}</p>
        </div>
      </div>
    </div>
  );
}
