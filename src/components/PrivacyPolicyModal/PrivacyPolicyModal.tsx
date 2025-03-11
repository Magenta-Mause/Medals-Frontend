import { Modal, ModalDialog, IconButton } from "@mui/joy";
import { Close } from "@mui/icons-material";
import PrivacyPolicyPage from "@pages/Legal/PrivacyPolicyPage";
import GenericModal from "@components/modals/GenericModal";
import { useTranslation } from "react-i18next";

const PrivacyPolicyModal = ({
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
      header={t("pages.privacyPolicyPage.title")}
      modalDialogSX={{ maxWidth: "90vw", maxHeight: "90vh" }}
      modalSX={{left: 0}}
    >
      <PrivacyPolicyPage />
    </GenericModal>
  );
};

export default PrivacyPolicyModal;
