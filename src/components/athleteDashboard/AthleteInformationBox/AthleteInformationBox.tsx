import React, { useContext } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { useTranslation } from "react-i18next";
import { Athlete } from "@customTypes/backendTypes";
import { Typography } from "@mui/joy";
import useFormatting from "@hooks/useFormatting";
import {
  GenericDashboardBoxContent,
  GenericDashboardBoxFooter,
  GenericDashboardBoxHeader,
} from "@components/athleteDashboard/GenericDashboardBox";

const AthleteInformationBox = () => {
  const { selectedUser } = useContext(AuthContext);
  const { t } = useTranslation();
  const { formatLocalizedDate } = useFormatting();
  if (selectedUser?.type != "ATHLETE") {
    return <>{t("components.athleteDashboard.error.notAnAthlete")}</>;
  }
  const athlete = selectedUser as unknown as Athlete;
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
      <GenericDashboardBoxFooter>
        {t("components.athleteDashboard.bornIn")}{" "}
        <Typography style={{ userSelect: "all" }}>
          {formatLocalizedDate(Date.parse(athlete.birthdate))}
        </Typography>
      </GenericDashboardBoxFooter>
    </>
  );
};

export default AthleteInformationBox;
