import { listItemsFromObject, formatCurrentData } from "./helperFunctions.js";
import {
  openWeatherKeyConfig as openWeatherKey,
  zipcodebaseKeyConfig as zipcodebaseKey,
} from "./config.js";
import countriesJson from "./countries.json" assert { type: "json" };

// store html elements
const localDataList = document.getElementById("localDataList");
const zipInput = document.querySelector("#zipInput");
const countryCodeInput = document.querySelector("#countryCodeInput");
const submit = document.querySelector("#submit");
const locationHeading = document.querySelector("#location");
const countrySelector = document.querySelector("#countrySelect");

const populateCountriesSelector = () => {
  for (const country in countriesJson) {
    const newOption = countrySelector.appendChild(
      document.createElement("option")
    );
    newOption.text = countriesJson[country]["name"];
    newOption.value = countriesJson[country]["code"];
  }
};

populateCountriesSelector();

// API CALL COMPONENTS
// Geolocation API:
const geolocationBaseUrl = "https://api.openweathermap.org/geo/1.0";

// Weather API:
const openWeatherBaseUrl = "https://api.openweathermap.org/data/3.0";
const units = "imperial";
const part = "minutely,hourly,daily,alerts";

const updatePage = async (event) => {
  event.preventDefault(); //do not clear page after submit
  // gather submitted location
  const zipCode = zipInput.value;
  const countryCode = countryCodeInput.value;
  // update location header for submitted location
  const locationName = await getLocationName(zipCode, countryCode);
  locationHeading.innerHTML = locationName;
  // get the coordinates
  const coordinates = await getCoordinates(zipCode, countryCode);
  const latitude = coordinates.lat;
  const longitude = coordinates.lon;
  const localData = await getLocalData(latitude, longitude);
  console.log(localData);
  //update data list on page
  listItemsFromObject(localData, localDataList);
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

// Return object of relevant local weather data for submitted location
const getLocalData = async (lat, lon) => {
  // build fetch url
  const coordinateQuery = `/onecall?lat=${lat}&lon=${lon}`;
  const paramsQuery = `&units=${units}&exclude=${part}`;
  const authQuery = `&appid=${openWeatherKey}`;
  const fetchUrl = `${openWeatherBaseUrl}${coordinateQuery}${paramsQuery}${authQuery}`;
  // process fetch data
  try {
    const response = await fetch(fetchUrl);
    if (response.ok) {
      const responseObject = await response.json();
      const timezone = responseObject["timezone"];
      const formattedDataObject = formatCurrentData(
        responseObject["current"],
        timezone
      );
      return formattedDataObject;
    }
  } catch (error) {
    console.log(error);
  }
};

submit.addEventListener("click", updatePage);
