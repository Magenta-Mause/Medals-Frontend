import React, { useState } from "react";
import GenericModal from "../GenericModal";
import { Radio, RadioGroup, FormControl, FormLabel, Button } from "@mui/joy";
import { FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import useApi from "@hooks/useApi";
import { SwimmingCertificateType } from "@customTypes/enums"; // Ensure this enum is defined in your frontend types.
import InfoTooltip from "@components/InfoTooltip/InfoTooltip";
import { useSnackbar } from "notistack";

interface CreateSwimCertificateModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  athleteId: number;
}

// Using enum values as the option values.
const certificateOptions = [
  {
    value: SwimmingCertificateType.ENDURANCE,
    labelKey: "components.createSwimCertificateModal.options.endurance.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.endurance.description",
  },
  {
    value: SwimmingCertificateType.SPRINT,
    labelKey: "components.createSwimCertificateModal.options.sprint.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.sprint.description",
  },
  {
    value: SwimmingCertificateType.JUNIOR,
    labelKey: "components.createSwimCertificateModal.options.junior.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.junior.description",
  },
  {
    value: SwimmingCertificateType.SENIOR,
    labelKey: "components.createSwimCertificateModal.options.senior.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.senior.description",
  },
  {
    value: SwimmingCertificateType.SUSTAINED,
    labelKey: "components.createSwimCertificateModal.options.sustained.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.sustained.description",
  },
  {
    value: SwimmingCertificateType.CLOTHED,
    labelKey: "components.createSwimCertificateModal.options.clothed.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.clothed.description",
  },
  {
    value: SwimmingCertificateType.BADGES,
    labelKey: "components.createSwimCertificateModal.options.badges.label",
    descriptionKey:
      "components.createSwimCertificateModal.options.badges.description",
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
  const [selectedOption, setSelectedOption] = useState<string>(
    certificateOptions[0].value,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addSwimmingCertificate(
        athleteId,
        selectedOption as SwimmingCertificateType,
      );
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

  return (
    <GenericModal
      header={t("components.createSwimCertificateModal.header")}
      open={open}
      setOpen={setOpen}
      disableEscape
      modalDialogSX={{ width: { md: "500px", xs: "90vw" } }}
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
        {/* Shift the entire radio group + label to the right */}
        <FormControl style={{ marginLeft: "20px" }}>
          <FormLabel
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {t("components.createSwimCertificateModal.form.selectCertificate")}
            <InfoTooltip
              text={t("components.createSwimCertificateModal.form.info")}
              header={t("components.createSwimCertificateModal.header")}
            />
          </FormLabel>
          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {certificateOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={
                  <div>
                    <strong style={{ marginLeft: "16px" }}>
                      {t(option.labelKey)}
                    </strong>
                    <div style={{ fontSize: "0.8rem", marginLeft: "16px" }}>
                      {t(option.descriptionKey)}
                    </div>
                  </div>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Button type="submit" disabled={loading}>
          {t("generic.submit")}
        </Button>
      </form>
    </GenericModal>
  );
};

export default CreateSwimCertificateModal;
