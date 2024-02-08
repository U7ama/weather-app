import React from "react";
import { Box, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

const handleLogin = () => {
  window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
};

const LoginPage = () => {
  return (
    <Box
      onClick={handleLogin}
      sx={{
        display: "flex",
        alignItems: "center",
        color: "white",
        "&:hover": { color: "#2d95bd" },
        cursor: "pointer",
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{
          "&:hover": { color: "#2d95bd" },
          color: "white",
          "@media (max-width: 400px)": {
            display: "none",
          },
        }}
      >
        Login
      </Typography>
      <LoginIcon
        sx={{
          marginLeft: 1,
          fontSize: { xs: "20px", sm: "22px", md: "26px" },
        }}
      />
    </Box>
  );
};

export default LoginPage;
