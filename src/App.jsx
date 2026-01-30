import { useEffect, useState } from "react";
import "./App.css";

const API_KEY = "217c6cc1a01d2dcadd2ae02ac4a15abf";

function App() {
  const [city, setCity] = useState(localStorage.getItem("city") || "Pune");
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState(null);

  const fetchWeather = async (cityName) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();
    if (data.cod !== 200) return;
    setWeather(data);
    setCity(cityName);
    localStorage.setItem("city", cityName);
  };

  const fetchByLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      setWeather(data);
      setCity(data.name);
      localStorage.setItem("city", data.name);
    });
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!input) return;
    fetchWeather(input);
    setInput("");
  };

  return (
    <div className="wrapper">
      <div className="box">
        <form onSubmit={submit} className="search">
          <input
            placeholder="City"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button>→</button>
        </form>

        <button className="geo" onClick={fetchByLocation}>
          Use current location
        </button>

        {weather && (
          <div className="content">
            <p className="city">
              {weather.name}, {weather.sys.country}
            </p>

            <h1>{Math.round(weather.main.temp)}°</h1>

            <p className="desc">{weather.weather[0].main}</p>

            <div className="stats">
              <span>Feels {weather.main.feels_like}°</span>
              <span>Humidity {weather.main.humidity}%</span>
              <span>Wind {weather.wind.speed} m/s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
