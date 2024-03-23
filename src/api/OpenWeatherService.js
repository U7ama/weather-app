const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const GEO_API_OPTIONS = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_GEO_API_KEY,
    'X-RapidAPI-Host': process.env.REACT_APP_GEO_API_HOST,
  },
};

export async function fetchWeatherData(lat, lon) {
  try {
    let [weatherPromise, forcastPromise] = await Promise.all([
      fetch(
        `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      ),
      fetch(
        `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      ),
    ]);

    const weatherResponse = await weatherPromise.json();
    const forcastResponse = await forcastPromise.json();
    return [weatherResponse, forcastResponse];
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCities(input) {
  try {
    const response = await fetch(
      `${GEO_API_URL}/cities?minPopulation=10000&namePrefix=${input}`,
      GEO_API_OPTIONS
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
}



// export async function fetchWeatherData(lat, lon) {
//   try {
//     const response = await fetch(
//       `${process.env.REACT_APP_BACKEND_URL}/fetchWeatherData`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ lat, lon }),
//       }
//     );
//     const data = await response.json();
//     // console.log("fetchWeatherData", data.data);
//     return data.data;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function fetchCities(input) {
//   try {
//     const response = await fetch(
//       `${process.env.REACT_APP_BACKEND_URL}/fetchCities`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ input: input ? input : "" }),
//       }
//     );
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log(error);
//     return;
//   }
// }
