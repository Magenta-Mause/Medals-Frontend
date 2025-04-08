import React, { useState } from "react";
import GenericModal from "../GenericModal";
import {
  FormControl,
  FormLabel,
  Button,
  Typography,
  List,
  ListItem,
  ListItemContent,
  Divider,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import useApi from "@hooks/useApi";
import { SwimmingCertificateType } from "@customTypes/enums";
import { useSnackbar } from "notistack";

interface CreateSwimCertificateModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  athleteId: number;
}

// Define your certificate options with translation keys.
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
          </FormLabel>

          <List sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            {certificateOptions.map((option, index) => (
              <React.Fragment key={option.value}>
                <ListItem
                  onClick={() => handleOptionClick(option.value)}
                  sx={(theme) => ({
                    padding: 1,
                    width: "100%",
                    borderRadius: 10,
                    cursor: "pointer",
                    // Highlight the selected option.
                    background:
                      selectedOption === option.value
                        ? theme.palette.mode === "dark"
                          ? "rgba(64,64,64,0.6)"
                          : "rgba(199,199,199,0.6)"
                        : "transparent",
                    "&:hover": {
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(64,64,64,0.6)"
                          : "rgba(199,199,199,0.6)",
                    },
                  })}
                >
                  <ListItemContent>
                    <Typography level="title-md" fontWeight="bold">
                      {t(option.labelKey)}
                    </Typography>
                    <Typography level="body-sm">
                      {t(option.descriptionKey)}
                    </Typography>
                  </ListItemContent>
                </ListItem>
                {index < certificateOptions.length - 1 && (
                  <Divider sx={{ margin: 0.7 }} component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        </FormControl>

        <Button type="submit" disabled={loading} sx={{ mt: 1 }}>
          {loading ? t("generic.submitting") : t("generic.submit")}
        </Button>
      </form>
    </GenericModal>
  );
};

export default CreateSwimCertificateModal;
