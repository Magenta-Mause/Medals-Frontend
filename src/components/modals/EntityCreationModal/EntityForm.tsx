import { Box, Button, FormControl, FormLabel, Input, Tooltip, IconButton } from "@mui/joy";
import InfoIcon from "@mui/icons-material/Info";
import { emailRegex } from "constants/regex";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import InfoTooltip from "@components/InfoTooltip/InfoTooltip";

interface EntityFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface FormElements extends HTMLFormControlsCollection {
  first_name: HTMLInputElement;
  last_name: HTMLInputElement;
  email: HTMLInputElement;
}

interface EntityData {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface EntityFormProps {
  submitCallback: (formValues: EntityData) => void;
  isPending: boolean;
  entityType: "trainer" | "admin";
  initialValues?: EntityData;
}

const EntityForm = ({
  submitCallback,
  isPending,
  entityType,
  initialValues,
}: EntityFormProps) => {
  const { t } = useTranslation();
  const [emailValid, setEmailValid] = useState(true);
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  
  const [firstName, setFirstName] = useState(initialValues?.first_name || "");
  const [lastName, setLastName] = useState(initialValues?.last_name || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  
  const isEditMode = !!initialValues;
  
  // Update form values when initialValues changes
  useEffect(() => {
    if (initialValues) {
      setFirstName(initialValues.first_name || "");
      setLastName(initialValues.last_name || "");
      setEmail(initialValues.email || "");
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
    }
  }, [initialValues]);

  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
  };

  const handleSubmit = (event: React.FormEvent<EntityFormElement>) => {
    event.preventDefault();
    
    let valid = true;

    // Only validate email in create mode
    if (!isEditMode && !validateEmail(email)) {
      setEmailValid(false);
      valid = false;
    }

    if (!firstName) {
      setFirstNameValid(false);
      valid = false;
    }

    if (!lastName) {
      setLastNameValid(false);
      valid = false;
    }

    if (valid) {
      submitCallback({
        id: initialValues?.id,
        first_name: firstName,
        last_name: lastName,
        // Keep the original email when in edit mode
        email: isEditMode ? initialValues.email : email,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 1 }}>
        <FormControl sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormLabel>{t("components.entityModal.form.email")}</FormLabel>
            {isEditMode && (
              <InfoTooltip
                  text={t("components.tooltip.emailNotEditable")}
                position="right"
              />
            )}
          </Box>
          <Input
            name="email"
            size="md"
            placeholder="someone@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailValid(true);
            }}
            error={!emailValid}
            disabled={isPending || isEditMode}
            readOnly={isEditMode}
            sx={isEditMode ? { 
              opacity: 0.7,
              backgroundColor: "neutral.100" 
            } : {}}
          />
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2 }}>
        <FormControl sx={{ width: "100%" }}>
          <FormLabel>
            {t("components.entityModal.form.firstName")}
          </FormLabel>
          <Input
            name="first_name"
            value={firstName}
            placeholder={t(
              "components.entityModal.form.firstNamePlaceholder",
            )}
            onChange={(e) => {
              setFirstName(e.target.value);
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
            {t("components.entityModal.form.lastName")}
          </FormLabel>
          <Input
            name="last_name"
            size="md"
            value={lastName}
            placeholder={t(
              "components.entityModal.form.lastNamePlaceholder",
            )}
            onChange={(e) => {
              setLastName(e.target.value);
              setLastNameValid(true);
            }}
            error={!lastNameValid}
            disabled={isPending}
          />
        </FormControl>
      </Box>
      <Button type="submit" loading={isPending} sx={{ marginTop: 3 }}>
        {isEditMode 
          ? t("components.entityModal.form.update", {
              entityType: t(`generic.${entityType}.singular`),
            })
          : t("components.entityModal.form.confirm", {
              entityType: t(`generic.${entityType}.singular`),
            })
        }
      </Button>
    </form>
  );
};

export default EntityForm;
