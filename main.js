import { listItemsFromObject, formatCurrentData } from "./helperFunctions.js";
import {
  openWeatherKeyConfig as openWeatherKey,
  zipcodebaseKeyConfig as zipcodebaseKey,
} from "./config.js";

// API CALL COMPONENTS
// Global:

// Geolocation API:
const geolocationBaseUrl = "https://api.openweathermap.org/geo/1.0";

// Weather API:
const localDataBaseUrl = "https://api.openweathermap.org/data/3.0";
const units = "imperial";
const part = "minutely,hourly,daily,alerts";

// store html elements
const localDataList = document.getElementById("localDataList");
const zipInput = document.querySelector("#zipInput");
const countryCodeInput = document.querySelector("#countryCodeInput");
const submit = document.querySelector("#submit");
const location = document.querySelector("#location");

const updatePage = async (event) => {
  event.preventDefault(); //do not clear page after submit
  // gather submitted location
  const zipCode = zipInput.value;
  const countryCode = countryCodeInput.value;
  // update location header for submitted location
  const locationName = await getLocationName(zipCode, countryCode);
  location.innerHTML = locationName;
  // get the coordinates
  const coordinates = await getCoordinates(zipCode, countryCode);
  const latitude = coordinates.lat;
  const longitude = coordinates.lon;
  const localData = await getLocalData(latitude, longitude);
  console.log(localData);
  //update data list on page
  listItemsFromObject(localData, localDataList);
};

// Return coordinates object based on zipcode.
const getCoordinates = async (zipCode, countryCode) => {
  // build fetch url
  const zipQuery = `/zip?zip=${zipCode},${countryCode}`;
  const authQuery = `&appid=${openWeatherKey}`;
  const fetchUrl = `${geolocationBaseUrl}${zipQuery}${authQuery}`;
  // process fetch data
  try {
    const response = await fetch(fetchUrl);
    if (response.ok) {
      const responseObject = await response.json();
      // getLocationName(zipCode);
      // getLocalData(lat, lon);
      const coordinates = {
        lat: responseObject["lat"],
        lon: responseObject["lon"],
      };
      return coordinates;
    } else {
      alert("Please enter valid zipcode and country code.");
    }
  } catch (error) {
    console.log(error);
  }
};

// Return string name of location being processed to display onscreen
const getLocationName = async (zipCode, countryCode) => {
  const fetchUrl = `https://app.zipcodebase.com/api/v1/search?apikey=${zipcodebaseKey}&codes=${zipCode}&country=${countryCode}`;
  try {
    const response = await fetch(fetchUrl);
    if (response.ok) {
      const responseObject = await response.json();
      const locationData = responseObject["results"][`${zipCode}`][0];
      return `${locationData["city"]}, ${locationData["state_code"]}`;
    }
  } catch (error) {
    console.log(error);
  }
};

// Return object of relevant local weather data for submitted location
const getLocalData = async (lat, lon) => {
  // build fetch url
  const coordinateQuery = `/onecall?lat=${lat}&lon=${lon}`;
  const paramsQuery = `&units=${units}&exclude=${part}`;
  const authQuery = `&appid=${openWeatherKey}`;
  const fetchUrl = `${localDataBaseUrl}${coordinateQuery}${paramsQuery}${authQuery}`;
  // process fetch data
  try {
    const response = await fetch(fetchUrl);
    if (response.ok) {
      const responseObject = await response.json();
      const formattedDataObject = formatCurrentData(responseObject["current"]);
      return formattedDataObject;
    }
  } catch (error) {
    console.log(error);
  }
};

// submit.addEventListener("click", getCoordinates);
submit.addEventListener("click", updatePage);
