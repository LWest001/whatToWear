import { listItemsFromObject, formatCurrentData } from "./helperFunctions.js";

// API CALL COMPONENTS
// Global:
const apiKey = "1590f969c740e8816dfe62664548bb03";

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

// Find coordinates based on zipcode.
const getCoordinates = async (event) => {
  event.preventDefault(); //do not clear page after submit
  // build fetch url
  const zipCode = zipInput.value;
  const countryCode = countryCodeInput.value;
  const zipQuery = `/zip?zip=${zipCode},${countryCode}`;
  const authQuery = `&appid=${apiKey}`;
  const fetchUrl = `${geolocationBaseUrl}${zipQuery}${authQuery}`;
  // process fetch data
  try {
    const response = await fetch(fetchUrl);
    if (response.ok) {
      const responseObject = await response.json();
      const lat = responseObject["lat"];
      const lon = responseObject["lon"];
      getLocalData(lat, lon);
    } else {
      alert("Please enter valid zipcode and country code.");
    }
  } catch (error) {
    console.log(error);
  }
};

/* This function costs money. uncomment as needed.*/
const getLocalData = async (lat, lon) => {
  // build fetch url
  const coordinateQuery = `/onecall?lat=${lat}&lon=${lon}`;
  const paramsQuery = `&units=${units}&exclude=${part}`;
  const authQuery = `&appid=${apiKey}`;
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
