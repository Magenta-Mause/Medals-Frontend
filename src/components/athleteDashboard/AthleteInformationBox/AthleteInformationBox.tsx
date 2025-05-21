import React, { useContext, useState } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { useTranslation } from "react-i18next";
import { Athlete } from "@customTypes/backendTypes";
import { Link, Typography } from "@mui/joy";
import {
  GenericDashboardBoxContent,
  GenericDashboardBoxFooter,
  GenericDashboardBoxHeader,
} from "@components/athleteDashboard/GenericDashboardBox";
import { useTypedSelector } from "@stores/rootReducer";
import AthleteAccessManagementModal from "@components/modals/AthleteAccessManagementModal/AthleteAccessManagementModal";

const AthleteInformationBox = () => {
  const trainers = useTypedSelector((state) => state.managingTrainer.data);
  const accessRequests = useTypedSelector((state) => state.accessRequests.data);
  const { selectedUser } = useContext(AuthContext);
  const [isRemoveTrainerAccessModal, setRemoveTrainerAccessModal] =
    useState(false);
  const { t } = useTranslation();

  if (selectedUser?.type !== "ATHLETE") {
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
      <GenericDashboardBoxContent
        sx={{
          height: "280%",
          fontSize: 17,
        }}
      >
        {trainers && trainers.length > 0 ? (
          <>
            <Typography color={"neutral"} level="title-md">
              {trainers.length > 1
                ? t("components.athleteDashboard.trainers.trainers")
                : t("components.athleteDashboard.trainers.trainer")}{" "}
              {trainers
                .map((trainer) => `${trainer.first_name} ${trainer.last_name}`)
                .join(", ")}
            </Typography>
          </>
        ) : (
          <Typography>
            {t("components.athleteDashboard.trainers.noTrainers")}
          </Typography>
        )}
        <br />
        {accessRequests.length > 0 && (
          <Typography level={"body-md"} color={"neutral"}>
            {accessRequests.length == 1
              ? t(
                  "components.athleteDashboard.trainers.accessRequestsPending.singular",
                )
              : t(
                  "components.athleteDashboard.trainers.accessRequestsPending.plural",
                ).replaceAll("{count}", accessRequests.length.toString())}
          </Typography>
        )}
      </GenericDashboardBoxContent>
      <GenericDashboardBoxFooter
        sx={{
          userSelect: "inherit",
        }}
      >
        <Link
          onClick={() => {
            setRemoveTrainerAccessModal(true);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter" || e.key == " ") {
              setRemoveTrainerAccessModal(true);
            }
          }}
          tabIndex={0}
        >
          {accessRequests.length > 0
            ? t("components.athleteDashboard.trainers.requestsPending")
            : t("components.athleteDashboard.trainers.removeTrainers")}
        </Link>
      </GenericDashboardBoxFooter>
      <AthleteAccessManagementModal
        isOpen={isRemoveTrainerAccessModal}
        setOpen={setRemoveTrainerAccessModal}
      />
    </>
  );
};

export default AthleteInformationBox;
