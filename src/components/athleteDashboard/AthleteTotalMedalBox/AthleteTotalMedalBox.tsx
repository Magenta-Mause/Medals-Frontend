import { useTypedSelector } from "@stores/rootReducer";
import { PerformanceRecording } from "@customTypes/backendTypes";
import { useContext } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import dayjs from "dayjs";
import {
  calculateTotalMedalFromAchievedPoints,
  calculateTotalPointsFromPerformanceRecordings,
} from "@utils/calculationUtil";
import {
  GenericDashboardBoxContent,
  GenericDashboardBoxFooter,
  GenericDashboardBoxHeader,
} from "@components/athleteDashboard/GenericDashboardBox";
import { Box, Typography } from "@mui/joy";
import { useMedalColors } from "@hooks/useMedalColors";

const AthleteTotalMedalBox = () => {
  const { selectedUser } = useContext(AuthContext);
  const medalColors = useMedalColors();
  const performanceRecordings = (
    useTypedSelector(
      (state) => state.performanceRecordings.data,
    ) as PerformanceRecording[]
  )
    .filter((p) => p.athlete_id == selectedUser?.id)
    .filter((p) => dayjs(p.date_of_performance).year() == dayjs().year());

  const totalPoints = calculateTotalPointsFromPerformanceRecordings(
    performanceRecordings,
  );
  const totalMedal = calculateTotalMedalFromAchievedPoints(totalPoints);

  return (
    <>
      <GenericDashboardBoxHeader>Total Medal</GenericDashboardBoxHeader>
      <GenericDashboardBoxContent>
        <Box
          sx={{
            display: "flex",
            textAlign: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "150px",
              height: "150px",
              background: medalColors[totalMedal],
              position: "relative",
              borderRadius: "100%",
              "::after": {
                content: "''",
                position: "absolute",
                width: "140px",
                height: "150px",
                background: "var(--joy-palette-background-surface)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -47%)",
                borderRadius: "100% 100% 0 0",
                pb: "20px",
              },
            }}
          >
            <Typography
              sx={{
                zIndex: 500,
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -70%)",
              }}
            >
              Gold
            </Typography>
          </Box>
          {totalMedal}
        </Box>
      </GenericDashboardBoxContent>
      <GenericDashboardBoxFooter>
        You've achieved {totalPoints} total points
      </GenericDashboardBoxFooter>
    </>
  );
};

export default AthleteTotalMedalBox;
