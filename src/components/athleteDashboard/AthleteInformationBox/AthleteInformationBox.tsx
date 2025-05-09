import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { useTranslation } from "react-i18next";
import { Athlete, Trainer } from "@customTypes/backendTypes";
import { Box, Typography } from "@mui/joy";
import useFormatting from "@hooks/useFormatting";
import {
  GenericDashboardBoxContent,
  GenericDashboardBoxFooter,
  GenericDashboardBoxHeader,
} from "@components/athleteDashboard/GenericDashboardBox";
import useApi from "@hooks/useApi";
import RemoveTrainerAccessModal from "@components/modals/RemoveTrainerAccessModal/RemoveTrainerAccessModal";

const AthleteInformationBox = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const { getTrainersAssignedToAthlete } = useApi();
  const [isMultipleTrainers, setMultipleTrainers] = useState(false);
  const { selectedUser } = useContext(AuthContext);
  const [isRemoveTrainerAccessModal, setRemoveTrainerAccessModal] =
    useState(false);
  const { t } = useTranslation();
  const { formatLocalizedDate } = useFormatting();
  if (selectedUser?.type != "ATHLETE") {
    return <>{t("components.athleteDashboard.error.notAnAthlete")}</>;
  }
  const athlete = selectedUser as unknown as Athlete;

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        if (athlete?.id !== undefined) {
          const trainerList = await getTrainersAssignedToAthlete(athlete.id);
          setTrainers(trainerList);
          if (trainerList.length > 1) {
            setMultipleTrainers(true);
          }
        } else {
          console.warn("Athlete ID is undefined.");
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchTrainers();
  }, [athlete.id, getTrainersAssignedToAthlete]);

  return (
    <>
      <GenericDashboardBoxHeader>
        {t("components.athleteDashboard.selectedUser")}
      </GenericDashboardBoxHeader>
      <GenericDashboardBoxContent
        sx={{
          height: "100%",
        }}
      >
        {athlete.first_name} {athlete.last_name}
      </GenericDashboardBoxContent>
      <GenericDashboardBoxContent
        sx={{
          height: "280%",
          fontSize: 17,
          opacity: 0.6,
        }}
      >
        {trainers && trainers.length > 0 ? (
          <>
            <Typography>
              {isMultipleTrainers
                ? t("components.athleteDashboard.trainers.trainers")
                : t("components.athleteDashboard.trainers.trainer")}
            </Typography>
            <Box>
              {trainers
                .map((trainer) => `${trainer.first_name} ${trainer.last_name}`)
                .join(", ")}
            </Box>
          </>
        ) : (
          <Typography>
            {t("components.athleteDashboard.trainers.noTrainers")}
          </Typography>
        )}
      </GenericDashboardBoxContent>
      {trainers.length > 0 && (
        <Typography
          sx={{
            opacity: 0.75,
          }}
        >
          <span
            onClick={() => {
              setRemoveTrainerAccessModal(true);
            }}
            style={{
              cursor: "pointer",
              color:
                "var(--variant-plainColor, rgba(var(--joy-palette-primary-mainChannel) / 1))",
            }}
          >
            {isMultipleTrainers
              ? t("components.athleteDashboard.trainers.removeTrainers")
              : t("components.athleteDashboard.trainers.removeTrainer")}
          </span>
        </Typography>
      )}

      <GenericDashboardBoxFooter>
        <Typography style={{ userSelect: "all" }}>
          {t("components.athleteDashboard.bornIn")}{" "}
          {formatLocalizedDate(Date.parse(athlete.birthdate))}
        </Typography>
      </GenericDashboardBoxFooter>
      <RemoveTrainerAccessModal
        isOpen={isRemoveTrainerAccessModal}
        setOpen={setRemoveTrainerAccessModal}
        trainers={trainers ?? []}
      />
    </>
  );
};

export default AthleteInformationBox;
