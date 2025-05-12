import {
  AspectRatio,
  Card,
  CardContent,
  CardOverflow,
  Typography,
  IconButton,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import { Download } from "@mui/icons-material";
import HoverTooltip from "@components/HoverTooltip/HoverTooltip";

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
    <Card variant="outlined" sx={{ pb: 0, gap: 0 }}>
      <CardOverflow>
        <AspectRatio ratio="2">
          <img
            src={"/assets/images/downloadPage/" + props.image}
            loading="lazy"
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          py: ".6rem",
        }}
      >
        <Typography level="title-lg" fontWeight={"inherit"}>
          {t("components.downloadCard.items." + props.path)}
        </Typography>
        <HoverTooltip text={t("components.downloadCard.downloadButton")}>
          <IconButton
            onClick={() => handleDownload("/assets/pdfs/" + props.path)}
            color="primary"
          >
            <Download />
          </IconButton>
        </HoverTooltip>
      </CardContent>
    </Card>
  );
};

export default DownloadCard;
