import useApi from "@hooks/useApi";
import { Divider, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TrainerInvitationForm from "./TrainerInvitationForm";

interface TrainerInvitationModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TrainerInvitationObject {
  email: string;
  first_name: string;
  last_name: string;
}

const TrainerInvitationModal = (props: TrainerInvitationModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [trainerInviteSubmitted, setTrainerInviteSubmitted] = useState(false);
  const { t } = useTranslation();

  const { inviteTrainer } = useApi();

  const handleSubmitTrainerInvitation = async (
    data: TrainerInvitationObject,
  ): Promise<void> => {
    console.log("Inviting trainer..");
    setTrainerInviteSubmitted(true);

    // send request here
    const invite_success = await inviteTrainer({
      id: -1,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    });

    if (invite_success) {
      props.setOpen(false);
      setTrainerInviteSubmitted(false);
      enqueueSnackbar(t("snackbar.inviteTrainer.success"), {
        variant: "success",
      });
    } else {
      props.setOpen(false);
      setTrainerInviteSubmitted(false);
      enqueueSnackbar(t("snackbar.inviteTrainer.failed"), {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Modal
        open={props.isOpen}
        onClose={() => {
          props.setOpen(false);
        }}
      >
        <ModalDialog sx={{ minWidth: "30%" }}>
          <ModalClose />
          <Typography>
            {t("components.trainerDatagrid.table.toolbar.addTrainer.content")}
          </Typography>
          <Divider inset="none" sx={{ marginBottom: 1 }} />
          <TrainerInvitationForm
            inviteCallback={(formValues: TrainerInvitationObject) => {
              handleSubmitTrainerInvitation(formValues);
            }}
            isPending={trainerInviteSubmitted}
          />
        </ModalDialog>
      </Modal>
    </>
  );
};

export default TrainerInvitationModal;
