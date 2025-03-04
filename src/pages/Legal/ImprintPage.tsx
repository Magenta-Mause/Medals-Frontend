import { Box, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

const ImprintPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        overflowY: "scroll",
        height: "100vh",
        pb: 2,
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
  );
};

export default ImprintPage;
