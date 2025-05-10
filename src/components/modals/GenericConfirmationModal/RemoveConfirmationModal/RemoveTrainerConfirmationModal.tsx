import useApi from "@hooks/useApi";
import { useTranslation } from "react-i18next";
import React from "react";
import { Athlete, Trainer } from "@customTypes/backendTypes";
import GenericConfirmationModal from "@components/modals/GenericConfirmationModal/GenericConfirmationModal";
import { enqueueSnackbar } from "notistack";

interface RemoveTrainerConnectionModalProps {
  athlete: Athlete;
  trainer: Trainer;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RemoveTrainerConfirmationModal = (
  props: RemoveTrainerConnectionModalProps,
) => {
  const { t } = useTranslation();
  const { removeTrainerAthleteConnection } = useApi();

  const remove = async () => {
    if (props.trainer?.id && props.athlete?.id) {
      await removeTrainerAthleteConnection(props.trainer.id, props.athlete.id);
      enqueueSnackbar(t("snackbar.removalConfirmationModal.success"), {
        variant: "success",
      });
    }
  };

  return (
    <>
      <GenericConfirmationModal
        header={t("components.confirmationModal.header")}
        description={t("components.confirmationModal.description2")}
        cancelText={t("components.confirmationModal.cancel")}
        confirmText={t("components.confirmationModal.remove")}
        confirmButtonColor="danger"
        isOpen={props.isOpen}
        setOpen={props.setOpen}
        onConfirm={remove}
      />
    </>
  );
};

export default RemoveTrainerConfirmationModal;
