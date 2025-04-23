import React from "react";
import Grid2 from "@mui/material/Grid2";
import AthleteInformationBox from "@components/athleteDashboard/AthleteInformationBox/AthleteInformationBox";
import GenericDashboardBox, {
  GenericDashboardBoxHeader,
} from "@components/athleteDashboard/GenericDashboardBox";
import AthleteActivityChart from "@components/athleteDashboard/AthleteActivityChart/AthleteActivityChart";
import { useTypedSelector } from "@stores/rootReducer";
import { PerformanceRecording } from "@customTypes/backendTypes";
import { useTranslation } from "react-i18next";
import AthletePerformanceRecordingsCountBox from "@components/athleteDashboard/AthletePerformanceRecordingsCountBox/AthletePerformanceRecordingsCountBox";
import AthleteSwimCertificateBox from "@components/athleteDashboard/AthleteSwimCertificateBox/AthleteSwimCertificateBox";

const AthleteDashboardPage = () => {
  const performanceRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const { t } = useTranslation();

  return (
    <Grid2 container spacing={2} sx={{ p: 2 }} alignItems={"stretch"}>
      <GenericDashboardBox size={{ md: 4, xs: 12 }}>
        <AthleteInformationBox />
      </GenericDashboardBox>
      <GenericDashboardBox size={{ md: 4, xs: 12 }}>
        <AthleteSwimCertificateBox />
      </GenericDashboardBox>
      <GenericDashboardBox size={{ md: 4, xs: 12 }}>
        <AthletePerformanceRecordingsCountBox />
      </GenericDashboardBox>
      <GenericDashboardBox size={{ md: 8, xs: 12 }}>
        <GenericDashboardBoxHeader>
          {t("components.athleteDashboard.activityChartHeader")}{" "}
          {new Date().getFullYear()}
        </GenericDashboardBoxHeader>
        <AthleteActivityChart performanceRecordings={performanceRecordings} />
      </GenericDashboardBox>
    </Grid2>
  );
};

export default AthleteDashboardPage;
