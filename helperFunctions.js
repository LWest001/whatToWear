// FOR TESTING
import testJson from "./openWeatherTest.json" assert { type: "json" };
const current = testJson["current"];
const date = new Date(current["dt"] * 1000);

// creates a new div in the body
const appendDivToBody = (id, innerHTML) => {
  const newElement = document.body.appendChild(document.createElement("div"));
  newElement.id = id;
  newElement.innerHTML = innerHTML;
  return newElement;
};

const createTimeDiv = appendDivToBody("time", date);
const jsonFormattingTestDiv = appendDivToBody(
  "jsonTestDiv",
  jsonStringConstructor(testJson, "current", "timezone")
);

