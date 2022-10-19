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
const weatherSection = document.getElementById("weatherInfo");
const clothingOptions = document.getElementById("clothingOptions");
const localDataList = document.getElementById("localDataList");
const testList = document.getElementById("testList");
const zipInput = document.querySelector("#zipInput");
const countryCodeInput = document.querySelector("#countryCodeInput");
const submit = document.querySelector("#submit");
const location = document.querySelector("#location");

// Find coordinates based on zipcode.
const getCoordinates = async (event) => {
  event.preventDefault(); //do not clear page after submit
  // build fetch url
  const zipCode = zipInput.value;
  const countryCode = countryCodeInput.value;
  const zipQuery = `/zip?zip=${zipCode},${countryCode}`;
  const authQuery = `&appid=${openWeatherKey}`;
  const fetchUrl = `${geolocationBaseUrl}${zipQuery}${authQuery}`;
  // process fetch data
  try {
    const response = await fetch(fetchUrl);
    if (response.ok) {
      const responseObject = await response.json();
      const lat = responseObject["lat"];
      const lon = responseObject["lon"];
      getLocationName(zipCode);
      getLocalData(lat, lon);
    } else {
      alert("Please enter valid zipcode and country code.");
    }
  } catch (error) {
    console.log(error);
  }
};

// Get name of location being processed to display onscreen
const getLocationName = async (zipCode, countryCode) => {
  const fetchUrl = `https://app.zipcodebase.com/api/v1/search?apikey=${zipcodebaseKey}&codes=${zipCode}&country=${countryCode}`;
  try {
    const response = await fetch(fetchUrl);
    if (response.ok) {
      const responseObject = await response.json();
    }
  } catch (error) {
    console.log(error);
  }
};

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
      const formattedObject = formatCurrentData(responseObject["current"]);
      listItemsFromObject(formattedObject, localDataList);
    }
  } catch (error) {
    console.log(error);
  }
};

submit.addEventListener("click", getCoordinates);
