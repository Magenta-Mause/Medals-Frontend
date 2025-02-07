import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/joy";
import DownloadFormat from "components/DownloadElement/DownloadSection";

const DownloadPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          {t("pages.downloadPage.header")}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "40px" }}>
        <Typography>{t("pages.downloadPage.headerText")}</Typography>
      </Box>

      <DownloadFormat />
    </>
  );
};

export default DownloadPage;
