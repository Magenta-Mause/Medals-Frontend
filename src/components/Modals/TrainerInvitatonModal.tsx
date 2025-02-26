import useApi from "@hooks/useApi";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface TrainerInvitationModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TrainerInvitatonModal = (props: TrainerInvitationModalProps) => {
  // Trainer invitation modal values
  const [trainerInviteForm, setTrainerInviteForm] = useState({
    email: "",
    emailInputValid: true,

    firstName: "",
    firstNameInputValid: true,

    lastName: "",
    lastNameInputValid: true,
  });

  const { enqueueSnackbar } = useSnackbar();

  const [trainerInviteSubmitted, setTrainerInviteSubmitted] = useState(false);

  const { t } = useTranslation();

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const { inviteTrainer } = useApi();

  const handleSubmitTrainerInvitation = (): void => {
    let error: boolean = false;

    if (!validateEmail(trainerInviteForm.email)) {
      setTrainerInviteForm((formData) => ({
        ...formData,
        emailInputValid: false,
      }));
      error = true;
    }

    if (!trainerInviteForm.firstName) {
      setTrainerInviteForm((formData) => ({
        ...formData,
        firstNameInputValid: false,
      }));
      error = true;
    }

    if (!trainerInviteForm.lastName) {
      setTrainerInviteForm((formData) => ({
        ...formData,
        lastNameInputValid: false,
      }));
      error = true;
    }

    if (error) return;

    console.log("Inviting trainer..");
    setTrainerInviteSubmitted(true);

    // send request here
    inviteTrainer({
      id: -1,
      email: trainerInviteForm.email,
      first_name: trainerInviteForm.firstName,
      last_name: trainerInviteForm.lastName,
    })
      .then(() => {
        props.setOpen(false);
        setTrainerInviteSubmitted(false);
        enqueueSnackbar(t("snackbar.inviteTrainer.success"), {
          variant: "success",
        });
      })
      .catch(() => {
        props.setOpen(false);
        setTrainerInviteSubmitted(false);
        enqueueSnackbar(t("snackbar.inviteTrainer.failed"), {
          variant: "error",
        });
      })
      .finally(() => {
        setTrainerInviteForm({
          email: "",
          emailInputValid: true,

          firstName: "",
          firstNameInputValid: true,

          lastName: "",
          lastNameInputValid: true,
        });
      });
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>
                {t("components.trainerDatagrid.inviteModal.email")}
              </FormLabel>
              <Input
                size="md"
                placeholder="someone@example.com"
                onChange={(event) => {
                  setTrainerInviteForm((formData) => ({
                    ...formData,
                    emailInputValid: true,
                    email: event.target.value,
                  }));
                }}
                error={!trainerInviteForm.emailInputValid}
                disabled={trainerInviteSubmitted}
              />
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>
                {t("components.trainerDatagrid.inviteModal.firstName")}
              </FormLabel>
              <Input
                placeholder={t(
                  "components.trainerDatagrid.inviteModal.firstNamePlaceholder",
                )}
                onChange={(event) => {
                  setTrainerInviteForm((formData) => ({
                    ...formData,
                    firstNameInputValid: true,
                    firstName: event.target.value,
                  }));
                }}
                error={!trainerInviteForm.firstNameInputValid}
                disabled={trainerInviteSubmitted}
              />
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>
                {t("components.trainerDatagrid.inviteModal.lastName")}
              </FormLabel>
              <Input
                size="md"
                placeholder={t(
                  "components.trainerDatagrid.inviteModal.lastNamePlaceholder",
                )}
                onChange={(event) => {
                  setTrainerInviteForm((formData) => ({
                    ...formData,
                    lastNameInputValid: true,
                    lastName: event.target.value,
                  }));
                }}
                error={!trainerInviteForm.lastNameInputValid}
                disabled={trainerInviteSubmitted}
              />
            </FormControl>
          </Box>
          <Button
            onClick={handleSubmitTrainerInvitation}
            loading={trainerInviteSubmitted}
            sx={{ marginTop: 1 }}
          >
            {t("components.trainerDatagrid.inviteModal.confirm")}
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default TrainerInvitatonModal;
