import { Box, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

const Disclaimer = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "background.level1",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "sm",
        mt: 2,
        textAlign: "center",
      }}
    >
      <Typography level="body-sm">{t("components.disclaimer.text")}</Typography>
    </Box>
  );
};

export default Disclaimer;
