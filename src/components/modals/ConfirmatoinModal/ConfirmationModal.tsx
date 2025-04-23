import useApi from "@hooks/useApi";
import { Box, Button, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import React, { useContext } from "react";
import { Athlete } from "@customTypes/backendTypes";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import GenericModal from "@components/modals/GenericModal";
import { enqueueSnackbar } from "notistack";

interface RemoveConnectionModalProps {
  selectedAthlete: Athlete;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AthleteRequestButton = (props: RemoveConnectionModalProps) => {
  const { t } = useTranslation();
  const { removeConnectionBetweenTrainerAthlete } = useApi();
  const { selectedUser } = useContext(AuthContext);

  const remove = async (
    athleteId: number | undefined,
    trainerId: number | undefined,
  ) => {
    if (athleteId === undefined || trainerId === undefined) {
      return;
    }
    await removeConnectionBetweenTrainerAthlete(athleteId, trainerId);
    enqueueSnackbar(t("snackbar.requestAthleteAccess.success"), {
      variant: "success",
    });
  };

  return (
    <>
      <GenericModal
        header={t("components.confirmationModal.header")}
        open={props.isOpen}
        setOpen={props.setOpen}
        modalSX={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          left: {
            md: "var(--Sidebar-width)",
            sm: "0",
          },
        }}
      >
        <Typography>
          {t("components.confirmationModal.confirmation")}
        </Typography>
        <Box
          sx={{
            left: 0,
          }}
        >
          <Button
            sx={{
              margin: 1,
            }}
            variant="outlined"
            onClick={() => {
              props.setOpen(false);
            }}
          >
            {t("components.confirmationModal.cancel")}
          </Button>
          <Button
            color="danger"
            onClick={() => {
              remove(props.selectedAthlete.id, selectedUser?.id);
            }}
          >
            {t("components.confirmationModal.remove")}
          </Button>
        </Box>
      </GenericModal>
    </>
  );
};

export default AthleteRequestButton;
