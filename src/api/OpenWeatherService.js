export async function fetchWeatherData(lat, lon) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/fetchWeatherData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lon }),
      }
    );
    const data = await response.json();
    // console.log("fetchWeatherData", data.data);
    return data.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCities(input) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/fetchCities`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input ? input : "" }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
}
