import { Box } from "@mui/joy";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import axios from "axios";

const HelpPage = () => {
  const { t } = useTranslation();
  const [markdownText, setMarkdownText] = useState("");
  useEffect(() => {
    (async () =>
      setMarkdownText(
        (await axios.get("/assets/help-page" + t("helpPage.markdownFileName")))
          .data,
      ))();
  }, [t]);

  return (
    <Box
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
  );
};

export default HelpPage;
