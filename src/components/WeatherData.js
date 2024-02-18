import { useEffect, useState } from "react";
import Weather from "./Weather";
import Loader from "./Loader.js";
import ErrorMessage from "./ErrorMessage";

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
export default WeatherData;
