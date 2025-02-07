import { Box } from "@mui/joy";
import { usePdfFiles } from "./PdfFiles";
import DownloadCard from "@components/DownloadElement/DownloadCard";

const DownloadFormat = () => {
  const pdfFiles = usePdfFiles();
  return (
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
        <DownloadCard title={pdf.name} pdfPath={pdf.path} image={pdf.image} />
      ))}
    </Box>
  );
};

export default DownloadFormat;
