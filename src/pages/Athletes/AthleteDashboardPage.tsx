import React from "react";
import Grid2 from "@mui/material/Grid2";
import AthleteInformationBox from "@components/athleteDashboard/AthleteInformationBox/AthleteInformationBox";
import GenericDashboardBox from "@components/athleteDashboard/GenericDashboardBox";
import AthletePerformanceRecordingsCountBox from "@components/athleteDashboard/AthletePerformanceRecordingsCountBox/AthletePerformanceRecordingsCountBox";
import AthleteSwimCertificateBox from "@components/athleteDashboard/AthleteSwimCertificateBox/AthleteSwimCertificateBox";
import AthleteActivityBox from "@components/athleteDashboard/AthleteActivityBox/AthleteActivityBox";
import AthleteTotalMedalBox from "@components/athleteDashboard/AthleteTotalMedalBox/AthleteTotalMedalBox";
import AthleteCategoryMedalBox from "@components/athleteDashboard/AthleteCategoryMedalBox/AthleteCategoryMedalBox";
import { DisciplineCategories } from "@customTypes/enums";

const AthleteDashboardPage = () => {
  return (
    <Grid2 container spacing={2} sx={{ p: 2 }} alignItems={"stretch"}>
      {/* First Row */}
      <GenericDashboardBox size={{ md: 4, xs: 12 }}>
        <AthleteInformationBox />
      </GenericDashboardBox>

      <GenericDashboardBox size={{ md: 4, xs: 12 }}>
        <AthleteSwimCertificateBox />
      </GenericDashboardBox>

      <GenericDashboardBox size={{ md: 4, xs: 12 }}>
        <AthletePerformanceRecordingsCountBox />
      </GenericDashboardBox>

      {/* Second Row */}
      <GenericDashboardBox size={{ md: 8, xs: 12 }}>
        <AthleteActivityBox />
      </GenericDashboardBox>
      <GenericDashboardBox size={{ md: 4, xs: 12 }}>
        <AthleteTotalMedalBox />
      </GenericDashboardBox>

      {/* Third Row */}
      <GenericDashboardBox size={{ md: 3, xs: 12 }}>
        <AthleteCategoryMedalBox category={DisciplineCategories.COORDINATION} />
      </GenericDashboardBox>
      <GenericDashboardBox size={{ md: 3, xs: 12 }}>
        <AthleteCategoryMedalBox category={DisciplineCategories.SPEED} />
      </GenericDashboardBox>
      <GenericDashboardBox size={{ md: 3, xs: 12 }}>
        <AthleteCategoryMedalBox category={DisciplineCategories.ENDURANCE} />
      </GenericDashboardBox>
      <GenericDashboardBox size={{ md: 3, xs: 12 }}>
        <AthleteCategoryMedalBox category={DisciplineCategories.STRENGTH} />
      </GenericDashboardBox>
    </Grid2>
  );
};

export default AthleteDashboardPage;
