import React from 'react';
import { Box, Button, Modal, Typography, Sheet } from '@mui/joy';

interface ConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ open, onClose, onConfirm, message }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Sheet
        variant="outlined"
        sx={{
          minWidth: 300,
          margin: 'auto',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <Typography level="h4" component="h2" sx={{ textAlign: 'center' }}>
          Bestätigung erforderlich
        </Typography>
        <Typography sx={{ textAlign: 'center' }}>
          {message}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="outlined" color="danger" onClick={onConfirm}>
            Löschen
          </Button>
        </Box>
      </Sheet>
    </Modal>
  );
};

export default ConfirmationPopup;
