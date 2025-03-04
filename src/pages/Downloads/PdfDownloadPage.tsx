import DownloadCard from "@components/DownloadCard/DownloadCard";
import { Box, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

const pdfFiles = [
  {
    path: "DSA_Einzelpruefkarte_2025.pdf",
    image: "single.jpg",
  },
  {
    path: "DSA_Gruppenpruefkarte_2025.pdf",
    image: "team.jpg",
  },
  {
    path: "DSA-Schwimmnachweis_2025.pdf",
    image: "swimming.jpg",
  },
  {
    path: "DSA_Leistungsuebersicht_2020.pdf",
    image: "2020.jpg",
  },
  {
    path: "DSA_Leistungsuebersicht_2023.pdf",
    image: "2023.jpg",
  },
  {
    path: "DSA_Leistungsuebersicht_2024.pdf",
    image: "2024.jpg",
  },
  {
    path: "DSA_Leistungsuebersicht_2025.pdf",
    image: "2025.jpg",
  },
];

const PdfDownloadPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Box>
        <Typography level="h2" component="h1">
          {t("pages.downloadPage.header")}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "40px" }}>
        <Typography>{t("pages.downloadPage.headerText")}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "space-around",
        }}
      >
        {pdfFiles.map((pdf) => (
          <Box
            sx={{
              width: "100%",
              maxWidth: "350px",
              flexGrow: 1,
            }}
            key={pdf.path}
          >
            <DownloadCard path={pdf.path} image={pdf.image} />
          </Box>
        ))}
      </Box>
    </>
  );
};

export default PdfDownloadPage;
