import React from 'react';
import { Box, Button, Modal, Typography, Sheet, Card } from '@mui/joy';
import { useTranslation } from 'react-i18next';

interface ConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ open, onClose, onConfirm, message }) => {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        
      }}>
      <Card sx={{ width: '50%', minWidth: "275px"}}>
        <Typography level="h4" component="h2" sx={{ textAlign: 'center' }}>
          {t("components.confirmationPopup.header")}
        </Typography>
        <Typography sx={{ textAlign: 'center' }}>
          {message}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: "center", width: "100%"}}>
          <Button variant="outlined" onClick={onClose}>
            {t("components.confirmationPopup.cancelButton")}
          </Button>
          <Button variant="outlined" color="danger" onClick={onConfirm}>
          {t("components.confirmationPopup.deleteButton")}

          </Button>
        </Box>
    </Card>
    </Box>
    </Modal>
  );
};

export default ConfirmationPopup;
