// creates a new div in the body
export const appendDivToBody = (id, innerHTML) => {
  const newElement = document.body.appendChild(document.createElement("div"));
  newElement.id = id;
  newElement.innerHTML = innerHTML;
  return newElement;
};

// builds a list from a given object (param 1) within a given ul element (param 2)
export const listItemsFromObject = (object, listElement) => {
  // clear out list
  if (listElement.children.length) {
    listElement.innerHTML = "";
  }

  for (const property in object) {
    const newLiItem = listElement.appendChild(document.createElement("li"));
    newLiItem.innerHTML = `${property}: ${object[property]}`;
  }
};

export const formatCurrentData = (object, timezone) => {
  // Items for use within new object
  let date = new Date(object["dt"] * 1000);
  date = date.toLocaleString("en-US", { timeZone: timezone });

  let sunriseTime = new Date(object["sunrise"] * 1000);
  sunriseTime = sunriseTime.toLocaleTimeString("en-US", { timeZone: timezone });

  let sunsetTime = new Date(object["sunset"] * 1000);
  sunsetTime = sunsetTime.toLocaleTimeString("en-US", { timeZone: timezone });

  const weather = object["weather"][0];

  // to deal with minute values under 10
  const fixMinutes = (getMinutesVal) => {
    if (getMinutesVal < 10) {
      return `0${getMinutesVal}`;
    } else {
      return getMinutesVal;
    }
  };

  // build object to display in list
  const newObject = {
    Date: date,
    Sunrise: sunriseTime,
    Sunset: sunsetTime,
    Temperature: object["temp"] + " F",
    "Feels like": object["feels_like"] + " F",
    Humidity: object["humidity"] + "%",
    "UV index": object["uvi"],
    "Wind speed": object["wind_speed"] + "mph",
    Weather: `${weather["main"]} (${weather["description"]})`,
  };
  return newObject;
};
