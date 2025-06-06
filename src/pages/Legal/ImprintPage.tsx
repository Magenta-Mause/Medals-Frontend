import { Box, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import Disclaimer from "@components/Disclaimer/Disclaimer";

const ImprintPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        overflowY: "scroll",
        height: "100vh",
        pb: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "column",
          alignItems: "center",
          height: "30%",
        }}
      >
        <Typography level="h1" sx={{ mb: 2 }}>
          {t("pages.imprintPage.title")}
        </Typography>
        <Typography level="body-sm" sx={{ mb: 2 }}>
          Simon Dietrich
        </Typography>
        <Typography level="body-sm" sx={{ mb: 2 }}>
          Am Pulverturm 54, 01705 Freital, Deutschland
        </Typography>
        <Typography level="h2" sx={{ mb: 2 }}>
          {t("pages.imprintPage.contact")}
        </Typography>
        <Typography level="body-sm" sx={{ mb: 2 }}>
          Email: medals.ageless325@passmail.net
        </Typography>
      </Box>
      <Disclaimer />
    </Box>
  );
};

export default ImprintPage;
