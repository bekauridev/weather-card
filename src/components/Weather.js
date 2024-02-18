import { useEffect } from "react";

function Weather({ data }) {
  const {
    location: { country, name: city },
    current: {
      condition: { text: weatherCondition, icon },
      temp_c: celsius,

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
export default Weather;
