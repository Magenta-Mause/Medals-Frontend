import { Box, Button, Modal, ModalDialog, Typography } from "@mui/joy";
import React from "react";
import { useTranslation } from "react-i18next";

interface ConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  open,
  onClose,
  onConfirm,
  message,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          left: {
            md: "var(--Sidebar-width)",
            sm: "0",
          },
        }}
      >
        <ModalDialog sx={{ maxWidth: "450px" }}>
          <Typography
            level="h4"
            component="h2"
            sx={{ textAlign: "center", mb: 1 }}
          >
            {t("components.confirmationPopup.header")}
          </Typography>
          <Typography sx={{ textAlign: "center", mb: 2 }}>{message}</Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Button variant="outlined" onClick={onClose}>
              {t("components.confirmationPopup.cancelButton")}
            </Button>
            <Button variant="outlined" color="danger" onClick={onConfirm}>
              {t("components.confirmationPopup.deleteButton")}
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default ConfirmationPopup;
