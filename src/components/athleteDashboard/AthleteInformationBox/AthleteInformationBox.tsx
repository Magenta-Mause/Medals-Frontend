import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { useTranslation } from "react-i18next";
import { Athlete, Trainer } from "@customTypes/backendTypes";
import { Typography } from "@mui/joy";
import useFormatting from "@hooks/useFormatting";
import {
  GenericDashboardBoxContent,
  GenericDashboardBoxFooter,
  GenericDashboardBoxHeader,
} from "@components/athleteDashboard/GenericDashboardBox";
import useApi from "@hooks/useApi";

const AthleteInformationBox = () => {
  const { getTrainersAssignedToAthlete } = useApi();
  const { selectedUser } = useContext(AuthContext);
  const { t } = useTranslation();
  const { formatLocalizedDate } = useFormatting();
  if (selectedUser?.type != "ATHLETE") {
    return <>{t("components.athleteDashboard.error.notAnAthlete")}</>;
  }
  const athlete = selectedUser as unknown as Athlete;
  const [trainers, setTrainers] = useState<Trainer[] | null>(null);

  useEffect(() => {
    async function fetchTrainers() {
      try {
        const trainerList = await getTrainersAssignedToAthlete(athlete.id!); // Get trainers asynchronously
        setTrainers(trainerList);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    }

    fetchTrainers();
  }, [athlete.id]);

  const trainersNames = trainers
    ? trainers
        .map((trainer) => `${trainer.first_name} ${trainer.last_name}`)
        .join(", ")
    : "Loading...";

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
          height: "390%",
          fontSize: "md",
        }}
      >
        {t("components.athleteDashboard.bornIn")}{" "}
        {formatLocalizedDate(Date.parse(athlete.birthdate))}
      </GenericDashboardBoxContent>
      <GenericDashboardBoxFooter>
        <Typography style={{ userSelect: "all" }}>
          {t("components.athleteDashboard.trainers", {
            trainers: trainersNames,
          })}
        </Typography>
      </GenericDashboardBoxFooter>
    </>
  );
};

export default AthleteInformationBox;
