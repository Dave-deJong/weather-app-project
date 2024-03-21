console.log("Weather you know");
// Plan
// function to retrieve and display weather
async function getAndDisplayWeather() {
  const weather = await retrieveWeather();
  displayWeather(weather);
}
// write a function to fetch the info from an API
async function retrieveWeather() {
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation,cloud_cover&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,wind_speed_10m_max"
  );
  if (!response.ok) {
    console.error(`Status: ${response.status}`);
    console.error(`Text: ${await response.text()}`);
    return;
  }
  const data = await response.json();
  return data;
}
// function to inject the dom with the weather
function displayWeather(weather) {
  const actualTime = document.getElementById("actualTime");
  actualTime.textContent = weather.current.time.toString().substring(11, 16);
  const currentTemp = document.getElementById("currentTemp");
  currentTemp.textContent = `Current Temperature:${weather.current.temperature_2m} °C`;
  const maxMinTemp = document.getElementById("currentMaxMin");
  maxMinTemp.textContent = `Max Temp: ${weather.daily.temperature_2m_max[0]} °C Min Temp: ${weather.daily.temperature_2m_min[0]} °C `;
  const sunrise = document.getElementById("sunrise");
  sunrise.textContent = `Sunrise : ${weather.daily.sunrise[0]
    .toString()
    .substring(11, 16)}`;
  const sunset = document.getElementById("sunset");
  sunset.textContent = `Sunset : ${weather.daily.sunset[0]
    .toString()
    .substring(11, 16)}`;
}
// place event listeners on the button
const updateButton = document.getElementById("updateButton");
updateButton.addEventListener("click", getAndDisplayWeather);
// write the function for the temp converter.
