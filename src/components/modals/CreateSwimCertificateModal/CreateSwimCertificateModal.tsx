import React, { useState } from "react";
import GenericModal from "../GenericModal";
import { FormControl, FormLabel, Button, Box } from "@mui/joy";
import { useTranslation } from "react-i18next";
import useApi from "@hooks/useApi";
import { SwimmingCertificateType } from "@customTypes/enums";
import InfoTooltip from "@components/InfoTooltip/InfoTooltip";
import { useSnackbar } from "notistack";
import CertificateOptionCard from "./CertificateOptionCard";

interface CreateSwimCertificateModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  athleteId: number;
}

// Using enum values as the option values.
const certificateOptions = [
  {
    value: SwimmingCertificateType.ENDURANCE,
    labelKey: "components.createSwimCertificateModal.options.ENDURANCE.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.ENDURANCE.description",
  },
  {
    value: SwimmingCertificateType.SPRINT,
    labelKey: "components.createSwimCertificateModal.options.SPRINT.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.SPRINT.description",
  },
  {
    value: SwimmingCertificateType.JUNIOR,
    labelKey: "components.createSwimCertificateModal.options.JUNIOR.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.JUNIOR.description",
  },
  {
    value: SwimmingCertificateType.SENIOR,
    labelKey: "components.createSwimCertificateModal.options.SENIOR.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.SENIOR.description",
  },
  {
    value: SwimmingCertificateType.SUSTAINED,
    labelKey: "components.createSwimCertificateModal.options.SUSTAINED.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.SUSTAINED.description",
  },
  {
    value: SwimmingCertificateType.CLOTHED,
    labelKey: "components.createSwimCertificateModal.options.CLOTHED.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.CLOTHED.description",
  },
  {
    value: SwimmingCertificateType.BADGES,
    labelKey: "components.createSwimCertificateModal.options.BADGES.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.BADGES.description",
  },
];

const CreateSwimCertificateModal: React.FC<CreateSwimCertificateModalProps> = ({
  open,
  setOpen,
  athleteId,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { addSwimmingCertificate } = useApi();
  const [selectedOption, setSelectedOption] = useState<SwimmingCertificateType>(
    certificateOptions[0].value
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addSwimmingCertificate(athleteId, selectedOption);
      enqueueSnackbar(t("snackbar.swimCertificate.creationSuccess"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error while adding swimming certificate:", error);
      enqueueSnackbar(t("snackbar.swimCertificate.creationError"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleOptionClick = (value: SwimmingCertificateType) => {
    setSelectedOption(value);
  };

  return (
    <GenericModal
      header={t("components.createSwimCertificateModal.header")}
      open={open}
      setOpen={setOpen}
      disableEscape
      modalDialogSX={{ width: { md: "520px", xs: "95vw" } }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
        <FormControl>
          <FormLabel
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              mb: 2,
            }}
          >
            {t("components.createSwimCertificateModal.form.selectCertificate")}
            <InfoTooltip
              text={t("components.createSwimCertificateModal.form.info")}
              header={t("components.createSwimCertificateModal.header")}
            />
          </FormLabel>

          <Box
            sx={{
              maxHeight: "60vh",
              overflowY: "auto",
              pr: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {certificateOptions.map((option) => (
              <CertificateOptionCard
                key={option.value}
                label={t(option.labelKey)}
                description={t(option.descriptionKey)}
                selected={selectedOption === option.value}
                onClick={() => handleOptionClick(option.value)}
              />
            ))}
          </Box>
        </FormControl>

        <Button type="submit" disabled={loading} sx={{ mt: 1 }}>
          {loading ? t("generic.submitting") : t("generic.submit")}
        </Button>
      </form>
    </GenericModal>
  );
};

export default CreateSwimCertificateModal;
