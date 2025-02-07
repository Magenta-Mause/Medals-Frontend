import { Box } from "@mui/joy";
import { usePdfFiles } from "./PdfFiles";
import {
  AspectRatio,
  Card,
  CardContent,
  CardOverflow,
  Typography,
  Link,
} from "@mui/joy";
import { useTranslation } from "react-i18next";

interface DownloadCardProps {
  title: string;
  path: string;
  image: string;
}

const DownloadSection = (props: DownloadCardProps) => {
  const { t } = useTranslation();
  const handleDownload = (pdfPath: string) => {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = pdfPath.split("/").pop() || "download.pdf";
    link.click();
  };
  const pdfFiles = usePdfFiles();
  return (
    <Box>
      <Card variant="outlined" sx={{ width: 320 }}>
        <CardOverflow>
          <AspectRatio ratio="2">
            <img src={props.image} loading="lazy" />
          </AspectRatio>
        </CardOverflow>
        <CardContent>
          <Typography level="title-md" fontWeight={"bold"}>
            {props.title}
          </Typography>
          <Typography level="body-sm">
            <Link
              href="#multiple-actions"
              onClick={() => handleDownload(props.path)}
            >
              {t("pages.downloadPage.downloadButton")}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DownloadSection;
