import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/joy";
import DownloadCard from "@components/DownloadCard/DownloadCard";

const DownloadPage = () => {
  const pdfFiles = [
    {
      path: "DSA_Einzelpruefkarte_2025.pdf",
      image: "/src/assets/single.jpg",
    },
    {
      path: "DSA_Gruppenpruefkarte_2025.pdf",
      image: "/src/assets/team.jpg",
    },
    {
      path: "DSA-Schwimmnachweis_2025.pdf",
      image: "/src/assets/swimming.jpg",
    },
    {
      path: "DSA_Leistungsuebersicht_2020.pdf",
      image: "/src/assets/2020.jpg",
    },
    {
      path: "DSA_Leistungsuebersicht_2023.pdf",
      image: "/src/assets/2023.jpg",
    },
    {
      path: "DSA_Leistungsuebersicht_2024.pdf",
      image: "/src/assets/2024.jpg",
    },
    {
      path: "DSA_Leistungsuebersicht_2025.pdf",
      image: "/src/assets/2025.jpg",
    },
  ];

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
          <DownloadCard path={pdf.path} image={pdf.image} />
        ))}
      </Box>
    </Box>
  );
};

export default DownloadPage;
