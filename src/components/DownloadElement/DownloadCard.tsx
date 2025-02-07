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
  pdfPath: string;
  image: string;
}

export default function DownlaodCard(props: DownloadCardProps) {
  const { t } = useTranslation();
  const handleDownload = (pdfPath: string) => {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = pdfPath.split("/").pop() || "download.pdf";
    link.click();
  };

  return (
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
            onClick={() => handleDownload(props.pdfPath)}
          >
            {t("pages.downloadPage.downloadButton")}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
