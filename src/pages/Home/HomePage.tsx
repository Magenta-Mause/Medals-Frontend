import { Box, Typography } from "@mui/joy";

const HomePage = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography level={"h1"} padding={"1.5rem"}>
        Medals
      </Typography>
      <Typography level={"h2"}>
        The soon to be Medal Management System
      </Typography>
    </Box>
  );
};

export default HomePage;
