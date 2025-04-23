import { Box, Button, FormControl, FormLabel, Input } from "@mui/joy";
import { emailRegex } from "constants/regex";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface EntityInvitationFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface FormElements extends HTMLFormControlsCollection {
  first_name: HTMLInputElement;
  last_name: HTMLInputElement;
  email: HTMLInputElement;
}

interface EntityFormProps {
  inviteCallback: (formValues: {
    first_name: string;
    last_name: string;
    email: string;
  }) => void;
  isPending: boolean;
  entityType: "trainer" | "admin";
}

const EntityInvitationForm = ({ inviteCallback, isPending, entityType }: EntityFormProps) => {
  const { t } = useTranslation();
  const [emailValid, setEmailValid] = useState(true);
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);

  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
  };

  const submitInvite = (
    event: React.FormEvent<EntityInvitationFormElement>,
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
      inviteCallback(data);
    }
  };

  return (
    <form onSubmit={submitInvite}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 1 }}>
        <FormControl sx={{ width: "100%" }}>
          <FormLabel>
            {t("components.entityInvitation.form.email")}
          </FormLabel>
          <Input
            name="email"
            size="md"
            placeholder="someone@example.com"
            onChange={() => {
              setEmailValid(true);
            }}
            error={!emailValid}
            disabled={isPending}
          />
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2 }}>
        <FormControl sx={{ width: "100%" }}>
          <FormLabel>
            {t("components.entityInvitation.form.firstName")}
          </FormLabel>
          <Input
            name="first_name"
            placeholder={t(
              "components.entityInvitation.form.firstNamePlaceholder"
            )}
            onChange={() => {
              setFirstNameValid(true);
            }}
            error={!firstNameValid}
            disabled={isPending}
          />
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2 }}>
        <FormControl sx={{ width: "100%" }}>
          <FormLabel>
            {t("components.entityInvitation.form.lastName")}
          </FormLabel>
          <Input
            name="last_name"
            size="md"
            placeholder={t(
              "components.entityInvitation.form.lastNamePlaceholder"
            )}
            onChange={() => {
              setLastNameValid(true);
            }}
            error={!lastNameValid}
            disabled={isPending}
          />
        </FormControl>
      </Box>
      <Button type="submit" loading={isPending} sx={{ marginTop: 3 }}>
        {t("components.entityInvitation.form.confirm", {
          entityType: t(`generic.${entityType}.singular`)
        })}
      </Button>
    </form>
  );
};

export default EntityInvitationForm;
