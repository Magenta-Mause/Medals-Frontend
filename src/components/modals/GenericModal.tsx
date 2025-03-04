import { Divider, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode, useState } from "react";

const GenericModal = (props: {
  header: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  disableEscape?: boolean;
  modalSX?: SxProps;
  modalDialogSX?: SxProps;
  children: ReactNode;
}) => {
  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      sx={{
        left: {
          md: "var(--Sidebar-width)",
          sm: "0",
        },
        ...props.modalSX,
      }}
      disableEscapeKeyDown={props.disableEscape ?? false}
    >
      <ModalDialog
        sx={{
          minWidth: { md: "400px", xs: "90vw" },
          overflowY: "auto",
          ...props.modalDialogSX,
        }}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            userSelect: "none",
          }}
          color="neutral"
        >
          {props.header}
          <ModalClose sx={{ position: "relative", top: 0, right: 0 }} />
        </Typography>
        <Divider inset="none" sx={{ marginBottom: 1 }} />
        {props.children}
      </ModalDialog>
    </Modal>
  );
};

export default GenericModal;
