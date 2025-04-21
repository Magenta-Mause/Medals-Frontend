import React, { useState } from "react";
import GenericModal from "../GenericModal";
import { Box, Button, FormControl, Sheet, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import useApi from "@hooks/useApi";
import { SwimmingCertificateType } from "@customTypes/enums";
import { useSnackbar } from "notistack";

interface CreateSwimCertificateModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  athleteId: number;
}

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
    certificateOptions[0].value,
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
      console.error("Error adding swimming certificate:", error);
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
      modalDialogSX={{ width: { md: "700px", xs: "95vw" } }}
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr",
              },
              gap: 1,
              maxHeight: "60vh",
              overflowY: "auto",
              pr: 1.5,
            }}
          >
            {certificateOptions.map((option) => {
              const isSelected = selectedOption === option.value;
              return (
                <Sheet
                  key={option.value}
                  variant="outlined"
                  onClick={() => handleOptionClick(option.value)}
                  sx={(theme) => ({
                    borderRadius: "md",
                    p: 2,
                    cursor: "pointer",
                    // Highlight selected option.
                    transition: "background ease .1s",
                    backgroundColor: isSelected
                      ? theme.palette.mode === "dark"
                        ? "rgba(150, 150, 255, 0.3) !important"
                        : "rgba(0, 0, 255, 0.1) !important"
                      : "transparent",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(30, 30, 30, 0.6)"
                          : "rgba(220, 220, 220, 0.6)",
                    },
                    "&:active": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(66, 66, 66, 0.6) !important"
                          : "rgba(180, 180, 180, 0.6) !important",
                    },
                  })}
                >
                  <Typography level="title-sm" fontWeight="bold" mb={0.5}>
                    {t(option.labelKey)}
                  </Typography>
                  <Typography level="body-xs">
                    {t(option.descriptionKey)}
                  </Typography>
                </Sheet>
              );
            })}
          </Box>
        </FormControl>

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          sx={{ alignSelf: "center", mt: 1 }}
        >
          {t("generic.submit")}
        </Button>
      </form>
    </GenericModal>
  );
};

export default CreateSwimCertificateModal;
