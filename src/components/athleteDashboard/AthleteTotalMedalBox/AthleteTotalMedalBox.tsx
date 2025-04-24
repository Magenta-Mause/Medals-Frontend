import { useTypedSelector } from "@stores/rootReducer";
import { PerformanceRecording } from "@customTypes/backendTypes";
import { useContext } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import dayjs from "dayjs";
import {
  calculateTotalMedalFromAchievedPoints,
  calculateTotalPointsFromPerformanceRecordings,
  convertMedalToNumber,
  convertNumberToMedal,
  medalMinPoints,
} from "@utils/calculationUtil";
import {
  GenericDashboardBoxContent,
  GenericDashboardBoxFooter,
  GenericDashboardBoxHeader,
} from "@components/athleteDashboard/GenericDashboardBox";
import { Box, Typography } from "@mui/joy";
import { useMedalColors } from "@hooks/useMedalColors";
import { Medals } from "@customTypes/enums";
import { useTranslation } from "react-i18next";

const AthleteTotalMedalBox = () => {
  const { selectedUser } = useContext(AuthContext);
  const medalColors = useMedalColors();
  const { t } = useTranslation();
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
  const nextMedal =
    totalMedal == Medals.GOLD
      ? undefined
      : convertNumberToMedal(convertMedalToNumber(totalMedal) + 1);
  const pointsMissing =
    nextMedal == undefined
      ? undefined
      : medalMinPoints[nextMedal] - totalPoints;

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
              background:
                totalMedal != Medals.NONE ? medalColors[totalMedal] : "gray",
              position: "relative",
              transition: "background .3s ease",
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
                userSelect: "none",
              }}
            >
              {totalMedal != Medals.NONE ? t("medals." + totalMedal) : "-"}
            </Typography>
          </Box>
          {totalMedal != Medals.GOLD ? (
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                top: "-20px",
                opacity: 0.5,
                userSelect: "none",
              }}
            >
              <Typography level={"body-md"}>
                {t(
                  "components.athleteDashboard.totalMedalBox.pointsMissingTemplate.prefix." +
                    (pointsMissing == 1 ? "singular" : "plural"),
                )}{" "}
                <Typography sx={{ fontWeight: "bold" }}>
                  {pointsMissing}
                </Typography>{" "}
                {pointsMissing! > 1
                  ? t("generic.points.plural")
                  : t("generic.points.singular")}{" "}
                {t(
                  "components.athleteDashboard.totalMedalBox.pointsMissingTemplate.between",
                )}{" "}
                <Typography sx={{ fontWeight: "bold" }}>
                  {t("medals." + nextMedal)}
                </Typography>{" "}
                {t(
                  "components.athleteDashboard.totalMedalBox.pointsMissingTemplate.postfix",
                )}
              </Typography>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </GenericDashboardBoxContent>
      <GenericDashboardBoxFooter>
        {t("components.athleteDashboard.totalMedalBox.pointsCount.prefix")}{" "}
        {totalPoints}{" "}
        {totalPoints == 1
          ? t("generic.points.singular")
          : t("generic.points.plural")}{" "}
        {t("components.athleteDashboard.totalMedalBox.pointsCount.postfix")}
      </GenericDashboardBoxFooter>
    </>
  );
};

export default AthleteTotalMedalBox;
