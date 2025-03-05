import React from "react";
import { Box, Button, Modal, Typography, ModalDialog } from "@mui/joy";
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
      <ModalDialog
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          maxWidth: "500px",
          gap: 5,
        }}
      >
        <Typography level="h4" component="h2" sx={{ textAlign: "center" }}>
          {t("components.confirmationPopup.header")}
        </Typography>
        <Typography
          sx={{ textAlign: "justify", textAlignLast: "justify", p: "0 10px" }}
        >
          {message}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Button onClick={onClose}>
            {t("components.confirmationPopup.cancelButton")}
          </Button>
          <Button color="danger" onClick={onConfirm}>
            {t("components.confirmationPopup.deleteButton")}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default ConfirmationPopup;
