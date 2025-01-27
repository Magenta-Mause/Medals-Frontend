import { Box, Chip, Typography } from "@mui/joy";

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
      <Chip size="lg" sx={{ aspectRatio: 1 }}>
        {" "}
        <Typography level={"h1"} fontSize={100}>
          🥇
        </Typography>
      </Chip>
      <Typography level={"h1"} padding={"1.5rem"} textAlign={"center"}>
        Medals
      </Typography>
      <Typography level={"h4"} color={"neutral"} textAlign={"center"}>
        The soon to be Medal Management System
      </Typography>
    </Box>
  );
};

export default HomePage;
