import GenericModal from "@components/modals/GenericModal";
import { Box, Button, Typography } from "@mui/joy";
import React from "react";
import { useTranslation } from "react-i18next";

interface ConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  header: string;
  message: string;
  confirmButtonText: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  open,
  onClose,
  onConfirm,
  header,
  message,
  confirmButtonText,
}) => {
  const { t } = useTranslation();

  return (
    <GenericModal
      header={header}
      open={open}
      setOpen={onClose}
      modalDialogSX={{ maxWidth: "450px" }}
    >
      <Box>
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
            {confirmButtonText}
          </Button>
        </Box>
      </Box>
    </GenericModal>
  );
};

export default ConfirmationPopup;
