// for handling API responses
function main(res) {
  if (!res) {
    return "test";
  }
  return res;
}

const jsonStringConstructor = (file, ...properties) => {
  let result = "";
  for (const p in properties) {
    result += main(file)[properties[p]];
  }
  return result;
};