import { Box, Chip, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

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
        <Typography level={"h1"} fontSize={100}>
          🥇
        </Typography>
      </Chip>
      <Typography level={"h1"} padding={"1.5rem"} textAlign={"center"}>
        {t("pages.homePage.h1")}
      </Typography>
      <Typography level={"h4"} color={"neutral"} textAlign={"center"}>
        {t("pages.homePage.h3")}
      </Typography>
    </Box>
  );
};

export default HomePage;
