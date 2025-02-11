import { Box, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

const UserRoleErrorPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      <Typography level={"h1"} padding={"1.5rem"}>
        {t("pages.userRoleError.h1")}
      </Typography>
      <Typography level={"h2"} color={"neutral"}>
        {t("pages.userRoleError.h2")}
      </Typography>
    </Box>
  );
};

export default UserRoleErrorPage;
