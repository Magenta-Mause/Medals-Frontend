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
      modalDialogSX={{ maxWidth: "90vw", maxHeight: "90vh" }}
      modalSX={{ left: 0 }}
    >
      <Box
        sx={{
          overflowY: "scroll",
          height: "47vh",
          width: "50vh",
          pb: 2,
        }}
      >
        <Typography level="h3" sx={{ mb: 2 }}>
          {t("pages.loginPage.info.sectionHeader")}
        </Typography>
        <Typography level="body-md" sx={{ mb: 2 }}>
          {t("pages.loginPage.info.greeting")
            .split("\n")
            .map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>{t("pages.loginPage.info.admin")}</li>
          <li>{t("pages.loginPage.info.trainer")}</li>
          <li>{t("pages.loginPage.info.athlete")}</li>
        </Box>
        <Typography level="body-md" sx={{ mb: 2, whiteSpace: "pre-line" }}>
          {t("pages.loginPage.info.content")}
          <u>medals.ageless325@passmail.net</u>
        </Typography>
      </Box>
    </GenericModal>
  );
};

export default InfoAtLoginModal;
