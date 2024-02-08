import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  SvgIcon,
  Typography,
  Button,
  Avatar,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Search from "./components/Search/Search";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import TodayWeather from "./components/TodayWeather/TodayWeather";
import { fetchWeatherData } from "./api/OpenWeatherService";
import { transformDateFormat } from "./utilities/DatetimeUtils";
import LoadingBox from "./components/Reusable/LoadingBox";
import WeatherInfo from "./assets/weather-news.png";
import ErrorBox from "./components/Reusable/ErrorBox";
import { ALL_DESCRIPTIONS } from "./utilities/DateConstants";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from "./utilities/DataUtils";
import LoginPage from "./components/Login/Login";
import CryptoJS from "crypto-js";

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get("user");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          storedUser,
          process.env.REACT_APP_SECRET_KEY
        );
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUser(decryptedData);
      } catch (error) {
        console.error("Error decrypting user data:", error);
      }
    }

    if (user) {
      const userObj = JSON.parse(decodeURIComponent(user));
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(userObj),
        process.env.REACT_APP_SECRET_KEY
      ).toString();
      localStorage.setItem("user", ciphertext);
      setUser(userObj);
      window.history.replaceState(null, null, window.location.origin);
    }
  }, []);

  const handleLogout = () => {
    // Clear user information from browser storage
    localStorage.removeItem("user");
    setUser(null);
  };

  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(" ");

    setIsLoading(true);

    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const [todayWeatherResponse, weekForecastResponse] =
        await fetchWeatherData(latitude, longitude);
      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "100%",
        minHeight: "500px",
      }}
    >
      <Box
        component="img"
        inheritViewBox
        sx={{
          fontSize: { xs: "100px", sm: "120px", md: "140px", width: "300px" },
        }}
        alt="weather"
        src={WeatherInfo}
      />

      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: "12px", sm: "14px" },
          color: "rgba(255,255,255, .85)",
          fontFamily: "Poppins",
          textAlign: "center",
          margin: "2rem 0",
          maxWidth: "80%",
          lineHeight: "22px",
        }}
      >
        Explore current weather data and 6-day forecast!
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
        <Grid item xs={12} md={todayWeather ? 6 : 12}>
          <Grid item xs={12}>
            <TodayWeather data={todayWeather} forecastList={todayForecast} />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "500px",
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: "10px", sm: "12px" },
              color: "rgba(255, 255, 255, .8)",
              lineHeight: 1,
              fontFamily: "Poppins",
            }}
          >
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <Container
      sx={{
        maxWidth: { xs: "95%", sm: "80%", md: "1100px" },
        width: "100%",
        height: "100%",
        margin: "0 auto",
        padding: "1rem 0 3rem",
        marginBottom: "1rem",
      }}
    >
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "white",
                "&:hover": { color: "#2d95bd" },
              }}
            >
              <WbSunnyIcon
                sx={{
                  fontSize: { xs: "20px", sm: "22px", md: "26px" },
                }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  marginLeft: 1,
                  "@media (max-width: 400px)": {
                    display: "none",
                  },
                }}
              >
                Weather App
              </Typography>
            </Box>
            {user ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  "&:hover": { color: "#2d95bd" },
                }}
              >
                <Avatar
                  alt={user?.displayName}
                  src={user?.photos?.[0]?.value}
                  sx={{ width: 32, height: 32, marginRight: 1 }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: "white",
                    marginLeft: 1,
                  }}
                >
                  {user.displayName}
                </Typography>

                <Button onClick={handleLogout}>
                  <Tooltip title="Logout">
                    <LogoutIcon
                      sx={{
                        fontSize: { xs: "20px", sm: "22px", md: "26px" },
                        color: "white",
                        "&:hover": { color: "#2d95bd" },
                      }}
                    />
                  </Tooltip>
                </Button>
              </Box>
            ) : (
              <LoginPage />
            )}
          </Box>
          <Search onSearchChange={searchChangeHandler} />
        </Grid>
        {appContent}
      </Grid>
    </Container>
  );
}

export default App;
