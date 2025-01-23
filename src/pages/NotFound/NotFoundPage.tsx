import { Box, Typography } from "@mui/joy";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      <Typography level={"h1"} padding={"1.5rem"}>
        404
      </Typography>
      <Typography level={"h2"} color={"neutral"}>
        Page Not Found
      </Typography>
    </Box>
  );
};

export default NotFoundPage;
