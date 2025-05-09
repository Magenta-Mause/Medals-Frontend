import React from "react";
import { Box, Button, Typography } from "@mui/joy";
import GenericModal from "@components/modals/GenericModal";

interface GenericConfirmationModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  header: string;
  description: string;
  confirmText: string;
  cancelText: string;
  confirmButtonColor?: "primary" | "danger";
  children?: React.ReactNode;
}

const GenericConfirmationModal: React.FC<GenericConfirmationModalProps> = ({
  isOpen,
  setOpen,
  onConfirm,
  header,
  description,
  cancelText,
  confirmText,
  confirmButtonColor = "primary",
}) => {
  return (
    <>
      <GenericModal
        header={header}
        open={isOpen}
        setOpen={setOpen}
        modalSX={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          left: {
            md: "var(--Sidebar-width)",
            sm: "0",
          },
        }}
      >
        <Typography>{description}</Typography>
        <Box
          sx={{
            justifyContent: "space-around",
            marginTop: 1,
          }}
        >
          <Button
            sx={{ margin: 1 }}
            variant="outlined"
            onClick={() => setOpen(false)}
          >
            {cancelText}
          </Button>
          <Button
            sx={{ margin: 1 }}
            color={confirmButtonColor}
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {confirmText}
          </Button>
        </Box>
      </GenericModal>
    </>
  );
};

export default GenericConfirmationModal;
