import { Athlete } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import GenericModal from "../GenericModal";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AthleteCreationForm from "./AthleteCreationForm";

interface AthleteCreationModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AthleteCreationModal = (props: AthleteCreationModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [athleteCreationSubmitted, setAthleteCreationSubmitted] = useState(false);
  const { createAthlete } = useApi();

  const handleSubmitAthleteCreation = async (data: Athlete) => {
    setAthleteCreationSubmitted(true);

    const success = await createAthlete(data);

    if (success) {
      props.setOpen(false);
      enqueueSnackbar(t("snackbar.createAthlete.success"), {
        variant: "success",
      });
    } else {
      enqueueSnackbar(t("snackbar.createAthlete.failed"), {
        variant: "error",
      });
    }
    setAthleteCreationSubmitted(false);
  };

  return (
    <GenericModal
      header={t("pages.athleteOverviewPage.createButton")}
      open={props.isOpen}
      setOpen={props.setOpen}
      modalDialogSX={{ minWidth: "30%" }}
      modalSX={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        left: { md: "var(--Sidebar-width)", sm: "0" },
      }}
    >
      <AthleteCreationForm
        submitCallback={handleSubmitAthleteCreation}
        isPending={athleteCreationSubmitted}
      />
    </GenericModal>
  );
};

export default AthleteCreationModal;
