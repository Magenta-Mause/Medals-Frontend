import { Modal, ModalDialog, IconButton } from "@mui/joy";
import { Close } from "@mui/icons-material";
import PrivacyPolicyPage from "@pages/Legal/PrivacyPolicyPage";

const PrivacyPolicyModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        aria-labelledby="privacy-policy-modal-title"
        aria-describedby="privacy-policy-modal-description"
        sx={{ maxWidth: "90vw", maxHeight: "90vh" }}
      >
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: "absolute", top: "1rem", right: "1rem" }}
        >
          <Close />
        </IconButton>
        <PrivacyPolicyPage />
      </ModalDialog>
    </Modal>
  );
};

export default PrivacyPolicyModal;
