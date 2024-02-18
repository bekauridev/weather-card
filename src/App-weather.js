import { useEffect, useState } from "react";
import Title from "./components/Title";
import Search from "./components/Search";
import ErrorMessage from "./components/ErrorMessage.js";
import WeatherData from "./components/WeatherData.js";

export default function App() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(function () {
    async function cityCall(latitude, longitude) {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (!res.ok) throw new Error("Current location not found");
        const data = await res.json();
        setSearch(data.city);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
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
      {isLoading && <ErrorMessage message="Loading" className="Error--green" />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
