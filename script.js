console.log("Weather you know");
// Plan
let unitsMetric = true;
let currentImage = "🌕";
let url =
  "https://api.open-meteo.com/v1/forecast?latitude=51.5085&longitude=-0.1257&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,wind_speed_10m_max,wind_direction_10m_dominant";

// function to retrieve and display weather
async function getAndDisplayWeather() {
  const weather = await retrieveWeather();
  displayWeather(weather);
}
// function to change the units
function changeUnits() {
  if (unitsMetric) {
    url =
      "https://api.open-meteo.com/v1/forecast?latitude=51.5085&longitude=-0.1257&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,wind_speed_10m_max,wind_direction_10m_dominant&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch";
    getAndDisplayWeather();
    unitsMetric = false;
  } else {
    url =
      "https://api.open-meteo.com/v1/forecast?latitude=51.5085&longitude=-0.1257&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,wind_speed_10m_max,wind_direction_10m_dominant";
    getAndDisplayWeather();
    unitsMetric = true;
  }
}
//display hourly weather
function displayHourlyWeather(weather) {
  const hourlySection = document.getElementById("hourlySection");
  while (hourlySection.firstChild) {
    hourlySection.removeChild(hourlySection.firstChild);
  }
  let j = 0;
  for (let i = 0; i < weather.hourly.time.length; i++) {
    if (weather.hourly.time[i] > weather.current.time) {
      // const hourName = `hour${i}Details`;
      const newHourly = document.createElement("div");
      const newHourTime = document.createElement("p");
      const newHourTemp = document.createElement("p");
      const newHourType = document.createElement("p");
      const newHourRain = document.createElement("p");
      hourlySection.appendChild(newHourly);
      newHourly.appendChild(newHourTime);
      newHourly.appendChild(newHourTemp);
      newHourly.appendChild(newHourType);
      newHourly.appendChild(newHourRain);
      newHourTime.textContent = weather.hourly.time[i]
        .toString()
        .substring(11, 16);
      newHourTemp.textContent = `${weather.hourly.temperature_2m[i]} ${weather.current_units.temperature_2m}`;
      newHourType.textContent = weatherCodeConverter(
        weather.hourly.weather_code[i]
      );
      newHourRain.textContent = `Rain : ${weather.hourly.precipitation_probability[i]}%`;
      j++;
      if (j > 4) {
        return;
      }
    }
  }
}
const weatherCode = {
  0: ["Clear Sky", "☀️"],
  1: ["Mainly Clear", "⛅"],
  2: ["Partly Cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Depositing Rime Fog", "🌫️"],
  51: ["Light Drizzle", "🌧️"],
  53: ["Moderate Drizzle", "🌧️"],
  55: ["Dense Drizzle", "🌧️"],
  56: ["Light Freezing Drizzle", "🌧️"],
  57: ["Dense Freezing Drizzle", "🌧️"],
  61: ["Slight Rain", "🌧️"],
  63: ["Moderate Rain", "🌧️"],
  65: ["Heavy Rain", "🌧️"],
  66: ["Light Freezing Rain", "🌧️"],
  67: [" Heavy	Freezing Rain", "🌧️"],
  71: ["Slight Snow fall", "🌨️"],
  73: ["Moderate Snow fall", "🌨️"],
  75: ["Heavy Snow fall", "🌨️"],
  77: ["Snow grains", "🌨️"],
  80: ["Slight Rain showers", "🌧️"],
  81: ["Moderate Rain Showers", "🌧️"],
  82: ["Violent Rain showers", "🌧️"],
  85: ["Slight Snow showers", "🌨️"],
  86: ["Heavy	Snow showers", "🌨️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with slight hail", "⛈️"],
  99: ["Thunderstorm with heavy hail", "⛈️"],
};
// write a function to fetch the info from an API
async function retrieveWeather() {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Status: ${response.status}`);
    console.error(`Text: ${await response.text()}`);
    return;
  }
  const data = await response.json();
  return data;
}

//function to convert Weather code to English
function weatherCodeConverter(weatherValue) {
  let weatherToConvert = weatherValue;
  weatherToConvert = weatherToConvert.toString();
  currentImage = weatherCode[weatherToConvert][1];
  return weatherCode[weatherToConvert][0];
}

// function to inject the dom with the weather
function displayWeather(weather) {
  const actualTime = document.getElementById("actualTime");
  actualTime.textContent = weather.current.time.toString().substring(11, 16);
  const currentTemp = document.getElementById("currentTemp");
  currentTemp.textContent = `Current Temperature:${weather.current.temperature_2m} ${weather.current_units.temperature_2m}`;
  const currentType = document.getElementById("currentType");
  currentType.textContent = weatherCodeConverter(weather.current.weather_code);
  const weatherIcon = document.getElementById("weatherIcon");
  weatherIcon.textContent = currentImage;
  const maxMinTemp = document.getElementById("currentMaxMin");
  maxMinTemp.textContent = `Max Temp: ${weather.daily.temperature_2m_max[0]} ${weather.current_units.temperature_2m} Min Temp: ${weather.daily.temperature_2m_min[0]} ${weather.current_units.temperature_2m} `;
  const windSpeed = document.getElementById("windSpeed");
  windSpeed.textContent = `Wind speed : ${weather.current.wind_speed_10m} ${weather.current_units.wind_speed_10m}`;
  const sunrise = document.getElementById("sunrise");
  sunrise.textContent = `Sunrise : ${weather.daily.sunrise[0]
    .toString()
    .substring(11, 16)}`;
  const sunset = document.getElementById("sunset");
  sunset.textContent = `Sunset : ${weather.daily.sunset[0]
    .toString()
    .substring(11, 16)}`;
  displayHourlyWeather(weather);
}
// place event listeners on the button
const updateButton = document.getElementById("updateButton");
updateButton.addEventListener("click", getAndDisplayWeather);
const unitsButton = document.getElementById("degreeConversion");
unitsButton.addEventListener("click", changeUnits);
document.addEventListener("DOMContentLoaded", getAndDisplayWeather);
