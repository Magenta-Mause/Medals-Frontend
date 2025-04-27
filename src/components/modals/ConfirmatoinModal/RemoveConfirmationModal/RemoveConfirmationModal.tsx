import useApi from "@hooks/useApi";
import { useTranslation } from "react-i18next";
import React, { useContext } from "react";
import { Athlete } from "@customTypes/backendTypes";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import GenericConfirmationModal from "@components/modals/ConfirmatoinModal/GenericConfirmationModal";
import { enqueueSnackbar } from "notistack";

interface RemoveConnectionModalProps {
  selectedAthletes: Athlete[];
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RemoveConfirmationModal = (props: RemoveConnectionModalProps) => {
  const { t } = useTranslation();
  const { removeTrainerAthleteConnection } = useApi();
  const { selectedUser } = useContext(AuthContext);

  const remove = async () => {
    if (selectedUser?.id && props.selectedAthletes.length > 0) {
      for (const athlete of props.selectedAthletes) {
        await removeTrainerAthleteConnection(selectedUser.id, athlete.id!);
        enqueueSnackbar(t("snackbar.removalConfirmationModal.success"), {
          variant: "success",
        });
      }
    }
  };

  const selectDescprition = () => {
    if (props.selectedAthletes.length > 1) {
      return t("components.confirmationModal.descriptionPural");
    } else {
      return t("components.confirmationModal.description");
    }
  };

  return (
    <>
      <GenericConfirmationModal
        header={t("components.confirmationModal.header")}
        description={selectDescprition()}
        cancelText={t("components.confirmationModal.cancel")}
        confirmText={t("components.confirmationModal.remove")}
        confirmButtonColor="danger"
        isOpen={props.isOpen}
        setOpen={props.setOpen}
        onConfirm={remove}
      ></GenericConfirmationModal>
    </>
  );
};

export default RemoveConfirmationModal;
