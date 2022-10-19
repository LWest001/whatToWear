const apiKey = "1590f969c740e8816dfe62664548bb03";
const zipInput = document.querySelector("#zipInput");
const zipcode = zipInput.value;

// Geolocation API call components
const geolocationUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${countrycode}&appid=${apiKey}`;

// Weather API call components
const lat = "71.06";
const lon = "42.36";
const units = "imperial";
const part = "minutely,hourly,daily,alerts";
const openWeatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=${part}&appid=${apiKey}`;

// get main body elements
const weatherSection = document.getElementById("weatherInfo");

/* This function costs money. uncomment as needed.
const testCall = async () => {
  const response = await fetch(openWeatherUrl);
  if (response.ok) {
    const jsonResponse = await response.json();
    console.log(jsonResponse["timezone"])
    return jsonResponse;
  }
};
*/
