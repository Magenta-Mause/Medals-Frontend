import { useTypedSelector } from "@stores/rootReducer";
import { PerformanceRecording } from "@customTypes/backendTypes";
import {
  GenericDashboardBoxContent,
  GenericDashboardBoxFooter,
  GenericDashboardBoxHeader,
} from "@components/athleteDashboard/GenericDashboardBox";
import { Typography } from "@mui/joy";
import React from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const AthletePerformanceRecordingsCountBox = () => {
  const performanceRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const { t } = useTranslation();
  const totalMedals = performanceRecordings.length;
  const medalsThisYear = performanceRecordings.filter(
    (p) => dayjs(p.date_of_performance).year() == dayjs().year(),
  ).length;

  return (
    <>
      <GenericDashboardBoxHeader>
        {t("components.athleteDashboard.totalPerformanceRecordings")}
      </GenericDashboardBoxHeader>
      <GenericDashboardBoxContent sx={{ height: "100%" }}>
        {totalMedals}
      </GenericDashboardBoxContent>
      <GenericDashboardBoxFooter>
        <Typography style={{ userSelect: "all" }} fontWeight={"bold"}>
          {medalsThisYear}
        </Typography>
        {t("components.athleteDashboard.performanceRecordingsThisYear")}
      </GenericDashboardBoxFooter>
    </>
  );
};

export default AthletePerformanceRecordingsCountBox;
