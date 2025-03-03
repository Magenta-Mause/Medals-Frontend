import { Box, Button, FormControl, FormLabel, Input } from "@mui/joy";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface TrainerInvitationFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface FormElements extends HTMLFormControlsCollection {
  first_name: HTMLInputElement;
  last_name: HTMLInputElement;
  email: HTMLInputElement;
}

const TrainerInvitationForm = (props: {
  inviteCallback: (formValues: {
    first_name: string;
    last_name: string;
    email: string;
  }) => void;
  isPending: boolean;
}) => {
  const { t } = useTranslation();
  const [emailValid, setEmailValid] = useState(true);
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const submitInviteTrainer = (
    event: React.FormEvent<TrainerInvitationFormElement>,
  ) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements;
    const data = {
      first_name: formElements.first_name.value,
      last_name: formElements.last_name.value,
      email: formElements.email.value,
    };

    let valid = true;

    if (!validateEmail(data.email)) {
      setEmailValid(false);
      valid = false;
    }

    if (!data.first_name) {
      setFirstNameValid(false);
      valid = false;
    }

    if (!data.last_name) {
      setLastNameValid(false);
      valid = false;
    }

    if (valid) {
      props.inviteCallback(data);
    }
  };

  return (
    <form onSubmit={submitInviteTrainer}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 1 }}>
        <FormControl sx={{ width: "100%" }}>
          <FormLabel>
            {t("components.trainerDatagrid.inviteModal.email")}
          </FormLabel>
          <Input
            name="email"
            size="md"
            placeholder="someone@example.com"
            onChange={() => {
              setEmailValid(true);
            }}
            error={!emailValid}
            disabled={props.isPending}
          />
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2 }}>
        <FormControl sx={{ width: "100%" }}>
          <FormLabel>
            {t("components.trainerDatagrid.inviteModal.firstName")}
          </FormLabel>
          <Input
            name="first_name"
            placeholder={t(
              "components.trainerDatagrid.inviteModal.firstNamePlaceholder",
            )}
            onChange={() => {
              setFirstNameValid(true);
            }}
            error={!firstNameValid}
            disabled={props.isPending}
          />
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2 }}>
        <FormControl sx={{ width: "100%" }}>
          <FormLabel>
            {t("components.trainerDatagrid.inviteModal.lastName")}
          </FormLabel>
          <Input
            name="last_name"
            size="md"
            placeholder={t(
              "components.trainerDatagrid.inviteModal.lastNamePlaceholder",
            )}
            onChange={() => {
              setLastNameValid(true);
            }}
            error={!lastNameValid}
            disabled={props.isPending}
          />
        </FormControl>
      </Box>
      <Button type="submit" loading={props.isPending} sx={{ marginTop: 3 }}>
        {t("components.trainerDatagrid.inviteModal.confirm")}
      </Button>
    </form>
  );
};

export default TrainerInvitationForm;
