import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { fetchCities } from "../../api/OpenWeatherService";
import { components } from "react-select";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { Box } from "@mui/material";

const Search = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState(null);
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        {" "}
        <GpsFixedIcon
          sx={{
            fontSize: { xs: "20px", sm: "22px", md: "26px" },
            color: "#004484",
            "&:hover": { color: "#2d95bd" },
          }}
        />
      </components.DropdownIndicator>
    );
  };
  const loadOptions = (inputValue) => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const citiesList = await fetchCities(inputValue);
          resolve({
            options: citiesList.data.map((city) => {
              return {
                value: `${city.latitude} ${city.longitude}`,
                label: `${city.name}, ${city.countryCode}`,
              };
            }),
          });
        }, reject);
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };

  const onChangeHandler = (enteredData) => {
    setSearchValue(enteredData);
    onSearchChange(enteredData);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box sx={{ width: "50%" }}>
        <AsyncPaginate
          placeholder="Search for cities"
          debounceTimeout={600}
          value={searchValue}
          components={{ DropdownIndicator }}
          onChange={onChangeHandler}
          loadOptions={loadOptions}
        />
      </Box>
    </Box>
  );
};

export default Search;
