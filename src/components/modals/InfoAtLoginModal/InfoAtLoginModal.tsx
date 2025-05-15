import { Box, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import GenericModal from "../GenericModal";

const InfoAtLoginModal = ({
  open,
  setOpen: setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();

  return (
    <GenericModal
      open={open}
      setOpen={setOpen}
      header={t("pages.loginPage.info.header")}
      modalDialogSX={{ maxWidth: "40vw", maxHeight: "75vh" }}
      modalSX={{ left: 0 }}
    >
      <Box>
        <Typography level="h3" sx={{ mb: 2 }}>
          {t("pages.loginPage.info.sectionHeader")}
        </Typography>
        <Typography level="body-md" sx={{ mb: 2, white: "pre-line" }}>
          {t("pages.loginPage.info.greeting")}.
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>{t("pages.loginPage.info.admin")}</li>
          <li>{t("pages.loginPage.info.trainer")}</li>
          <li>{t("pages.loginPage.info.athlete")}</li>
        </Box>
        <Typography level="body-md" sx={{ mb: 2, whiteSpace: "pre-line" }}>
          {t("pages.loginPage.info.content")}
          <a href={"mailto:medals.ageless325@passmail.net"}>
            medals.ageless325@passmail.net
          </a>
        </Typography>
      </Box>
    </GenericModal>
  );
};

export default InfoAtLoginModal;
