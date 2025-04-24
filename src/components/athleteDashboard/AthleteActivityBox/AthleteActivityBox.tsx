import {
  GenericDashboardBoxFooter,
  GenericDashboardBoxHeader,
} from "@components/athleteDashboard/GenericDashboardBox";
import { Link } from "@mui/joy";
import { OpenInNew } from "@mui/icons-material";
import React, { useContext, useMemo } from "react";
import { useTypedSelector } from "@stores/rootReducer";
import { PerformanceRecording } from "@customTypes/backendTypes";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import AthleteActivityChartV2 from "@components/athleteDashboard/AthleteActivityChart/AthleteActivityChartV2";

const AthleteActivityBox = () => {
  const { selectedUser } = useContext(AuthContext);
  const allRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const performanceRecordings = useMemo(() => {
    return allRecordings.filter((p) => p.athlete_id === selectedUser?.id);
  }, [allRecordings, selectedUser?.id]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <GenericDashboardBoxHeader
        sx={{
          mb: "10px",
        }}
      >
        {t("components.athleteDashboard.activityChart.header")}{" "}
        {new Date().getFullYear()}
      </GenericDashboardBoxHeader>
      <AthleteActivityChartV2 performanceRecordings={performanceRecordings} />
      <GenericDashboardBoxFooter sx={{ textAlign: "right" }}>
        <Link
          onClick={() => {
            navigate("/performances");
          }}
        >
          {t("components.athleteDashboard.activityChart.link")}
          <OpenInNew sx={{ py: "5px" }} />
        </Link>
      </GenericDashboardBoxFooter>
    </>
  );
};

export default AthleteActivityBox;
