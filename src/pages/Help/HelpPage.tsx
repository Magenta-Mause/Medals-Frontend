import { Box, Button } from "@mui/joy";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import axios from "axios";
import { DownloadRounded } from "@mui/icons-material";

const HelpPage = () => {
  const { t, i18n } = useTranslation();
  const [markdownText, setMarkdownText] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setMarkdownText(
          (
            await axios.get(
              "/assets/help-page" + t("helpPage.markdownFileName"),
            )
          ).data,
        );
      } catch (error) {
        console.error("Error loading markdown:", error);
      }
    })();
  }, [t]);

  const handleDownloadPdf = () => {
    const languageToPdfMap: Record<string, string> = {
      en: "Medals_HelpPage_en-US.pdf",
      de: "Medals_HelpPage_de-DE.pdf",
      fr: "Medals_HelpPage_fr-FR.pdf",
      es: "Medals_HelpPage_es-ES.pdf",
      nl: "Medals_HelpPage_nl-NL.pdf",
    };

    const currentLang = i18n.language?.split("-")[0] || "en";

    const pdfFilename = languageToPdfMap[currentLang] || languageToPdfMap.en;

    const pdfUrl = `/assets/help-page/pdf/${pdfFilename}`;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", pdfFilename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleDownloadPdf}
          disabled={!markdownText}
          startDecorator={<DownloadRounded />}
        >
          {t("pages.helpPage.button")}
        </Button>
      </Box>

      <Box
        id="markdown-container"
        sx={{
          "> p > img": {
            borderRadius: "5px",
            maxWidth: "80%",
          },
          "> h3": {
            marginTop: "50px",
          },
        }}
      >
        <Markdown>{markdownText}</Markdown>
      </Box>
    </Box>
  );
};

export default HelpPage;
