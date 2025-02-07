import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/joy";
import { usePdfFiles } from "@components/DownloadCard/PdfFiles";
import DownloadCard from "@components/DownloadCard/DownloadCard";

const DownloadPage = () => {
  const pdfFiles = usePdfFiles();
  const { t } = useTranslation();
  return (
    <Box>
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 7,
        }}
      >
        {pdfFiles.map((pdf) => (
          <DownloadCard title={pdf.title} path={pdf.path} image={pdf.image} />
        ))}
      </Box>
    </Box>
  );
};

export default DownloadPage;
