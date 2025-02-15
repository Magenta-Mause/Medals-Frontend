import {
  AspectRatio,
  Card,
  CardContent,
  CardOverflow,
  Typography,
  Link,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import { Download } from "@mui/icons-material";

interface DownloadCardProps {
  path: string;
  image: string;
}

const DownloadCard = (props: DownloadCardProps) => {
  const { t } = useTranslation();
  const handleDownload = (pdfPath: string) => {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = pdfPath.split("/").pop() || "download.pdf";
    link.click();
  };

  return (
    <Card variant="outlined">
      <CardOverflow>
        <AspectRatio ratio="2">
          <img
            src={"/assets/images/downloadPage/" + props.image}
            loading="lazy"
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography level="title-md" fontWeight={"bold"}>
          {t("components.downloadCard.items." + props.path)}
        </Typography>
        <Typography level="body-sm">
          <Link
            href="#multiple-actions"
            onClick={() => handleDownload("/assets/pdfs/" + props.path)}
          >
            {t("components.downloadCard.downloadButton")}
            <Download />
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DownloadCard;
