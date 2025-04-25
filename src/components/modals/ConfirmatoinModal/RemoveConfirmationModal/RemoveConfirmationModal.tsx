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

const RemoveConnectionModal = (props: RemoveConnectionModalProps) => {
  const { t } = useTranslation();
  const { removeTrainerAthleteConnection } = useApi();
  const { selectedUser } = useContext(AuthContext);

  const remove = async () => {
    if (selectedUser?.id && props.selectedAthletes.length > 0) {
      const athleteIds: number[] =
        props.selectedAthletes
          ?.map((athlete) => athlete.id)
          .filter((id): id is number => id !== undefined) || [];

      await removeTrainerAthleteConnection(selectedUser.id, athleteIds);
      enqueueSnackbar(t("snackbar.removalConfirmationModal.success"), {
        variant: "success",
      });
    }
  };

  return (
    <>
      <GenericConfirmationModal
        header={t("components.confirmationModal.header")}
        description={t("components.confirmationModal.description")}
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

export default RemoveConnectionModal;
