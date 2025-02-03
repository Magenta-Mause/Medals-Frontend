import LanguageSelectionButton from "@components/LanguageSelectionButton/LanguageSelectionButton";
import { Box, Button, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const LoginNeededPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        px: { xs: 1, md: 3 },
        pt: 3,
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "calc(100dvh)",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 5,
      }}
    >
      <Box></Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          width: { md: "30%", xs: "80%" },
        }}
      >
        <Typography level="h1" textAlign={"center"}>
          {t("pages.loginRequiredPage.h1")}
        </Typography>
        <Typography level="h3" color="neutral" textAlign={"center"}>
          {t("pages.loginRequiredPage.h2")}
        </Typography>
        <Button
          size="lg"
          fullWidth
          onClick={() => {
            navigate("/login");
          }}
        >
          {t("pages.loginRequiredPage.loginButton")}
        </Button>
      </Box>
      <Box
        component={"footer"}
        sx={{ display: "flex", justifyContent: "flex-start", width: "100%" }}
      >
        <LanguageSelectionButton />
      </Box>
    </Box>
  );
};

export default LoginNeededPage;
