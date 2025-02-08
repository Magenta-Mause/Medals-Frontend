import { Box } from "@mui/joy";
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
  path: string;
  image: string;
}

const DownloadCard = (props: DownloadCardProps) => {
  const title = props.path
    .replace("/assets/images/downloadPage/", "")
    .replace("/assets/pdfs/", "")
    .replace(".pdf", "");
  const { t } = useTranslation();
  const handleDownload = (pdfPath: string) => {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = pdfPath.split("/").pop() || "download.pdf";
    link.click();
  };

  return (
    <Box>
      <Card variant="outlined">
        <CardOverflow>
          <AspectRatio ratio="2">
            <img src={props.image} loading="lazy" />
          </AspectRatio>
        </CardOverflow>
        <CardContent>
          <Typography level="title-md" fontWeight={"bold"}>
            {t("components.downloadCard.items." + title)}
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

export default DownloadCard;
