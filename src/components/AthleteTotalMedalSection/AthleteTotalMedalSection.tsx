import MedalIcon from "@components/icons/MedalIcon/MedalIcon";
import { Medals } from "@customTypes/enums";
import { Box, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { Athlete } from "@customTypes/backendTypes";
import { useTypedSelector } from "@stores/rootReducer";
import { useMemo } from "react";
import dayjs from "dayjs";
import {
  calculateTotalMedalFromAchievedPoints,
  calculateTotalMedalFromPerformanceRecordings,
  calculateTotalPointsFromPerformanceRecordings,
} from "@utils/calculationUtil";

const AthleteTotalMedalSection = (props: {
  athlete: Athlete;
  selectedYear: number;
}) => {
  const performanceRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  );
  const filteredPerformanceRecordings = useMemo(
    () =>
      performanceRecordings.filter(
        (p) =>
          p.athlete.id == props.athlete.id &&
          dayjs(p.date_of_performance).year() == props.selectedYear,
      ),
    [performanceRecordings, props.athlete.id, props.selectedYear],
  );
  const totalPoints = calculateTotalPointsFromPerformanceRecordings(
    filteredPerformanceRecordings,
  );

  const totalMedal = props.athlete.swimming_certificate
    ? calculateTotalMedalFromPerformanceRecordings(
        filteredPerformanceRecordings,
      )
    : Medals.NONE;

  const { t } = useTranslation();

  return (
    <Box
      sx={{
        padding: "15px 20px",
        borderRadius: 10,
        background: "var(--joy-palette-background-level2)",
        width: "100%",
        mb: "5px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          minHeight: "50px",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
        >
          <Box>
            <MedalIcon medalType={totalMedal} />
          </Box>
          <Box>
            <Typography level="h4" sx={{ fontSize: "md" }}>
              {!props.athlete.swimming_certificate ? (
                t("components.athleteTotalMedalBox.noSwimmingCertificate")
              ) : totalMedal ==
                calculateTotalMedalFromAchievedPoints(totalPoints) ? (
                <>
                  {t("generic.deutschesSportabzeichen")}:{" "}
                  {t("medals." + totalMedal)}
                </>
              ) : (
                t("components.athleteTotalMedalBox.categoryMissing")
              )}
            </Typography>
            <Typography level="body-sm">
              {t("components.athleteTotalMedalBox.theyAchieved")}
              {totalPoints}{" "}
              {totalPoints == 1
                ? t("generic.points.singular")
                : t("generic.points.plural")}{" "}
              {t("components.athleteTotalMedalBox.achieved")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AthleteTotalMedalSection;
