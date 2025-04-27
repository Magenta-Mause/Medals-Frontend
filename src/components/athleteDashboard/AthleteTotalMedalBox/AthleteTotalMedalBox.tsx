import { useTypedSelector } from "@stores/rootReducer";
import { PerformanceRecording } from "@customTypes/backendTypes";
import { useContext, useMemo } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import dayjs from "dayjs";
import {
  calculateBestMedalPerCategoryFromPerformanceRecordings,
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
import { Box, CardContent, Typography } from "@mui/joy";
import { useMedalColors } from "@hooks/useMedalColors";
import { Medals } from "@customTypes/enums";
import { useTranslation } from "react-i18next";

const AthleteTotalMedalBox = () => {
  const { selectedUser } = useContext(AuthContext);
  const athlete = useTypedSelector((state) => state.athletes.data).filter(
    (athlete) => athlete.id == selectedUser?.id,
  );
  const medalColors = useMedalColors();
  const { t } = useTranslation();
  const performanceRecordings = (
    useTypedSelector(
      (state) => state.performanceRecordings.data,
    ) as PerformanceRecording[]
  )
    .filter((p) => p.athlete_id == selectedUser?.id)
    .filter((p) => dayjs(p.date_of_performance).year() == dayjs().year());

  const totalPoints = useMemo(
    () => calculateTotalPointsFromPerformanceRecordings(performanceRecordings),
    [performanceRecordings],
  );
  const bestMedalsPerCategory = useMemo(
    () =>
      calculateBestMedalPerCategoryFromPerformanceRecordings(
        performanceRecordings,
      ),
    [performanceRecordings],
  );
  const isMedalMissing = Object.values(bestMedalsPerCategory).includes(
    Medals.NONE,
  );
  const totalMedal = !isMedalMissing
    ? calculateTotalMedalFromAchievedPoints(totalPoints)
    : Medals.NONE;
  const nextMedal =
    totalMedal == Medals.GOLD
      ? undefined
      : convertNumberToMedal(convertMedalToNumber(totalMedal) + 1);
  const pointsMissing =
    nextMedal == undefined
      ? undefined
      : medalMinPoints[nextMedal] - totalPoints;
  const swimCertificateMissing = !athlete[0]?.swimming_certificate;

  return (
    <>
      <Box sx={{ position: "relative", height: "100%" }}>
        <Box
          sx={{
            position: "absolute",
            opacity: swimCertificateMissing ? 1 : 0,
            transition: "opacity ease .3s",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            zIndex: 9999,
            pointerEvents: swimCertificateMissing ? "all" : "none",
            gap: "15px",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              width: "70%",
            }}
          >
            {t(
              "components.athleteDashboard.totalMedalBox.noSwimCertificate.blurText",
            )}
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              width: "75%",
            }}
            color={"neutral"}
            level={"body-sm"}
          >
            {t(
              "components.athleteDashboard.totalMedalBox.noSwimCertificate.pointDisplay.prefix",
            )}{" "}
            {totalPoints}{" "}
            {totalPoints == 1
              ? t("generic.points.singular")
              : t("generic.points.plural")}{" "}
            {totalMedal != Medals.NONE
              ? t(
                  "components.athleteDashboard.totalMedalBox.noSwimCertificate.pointDisplay.between",
                ) +
                " " +
                t("medals." + totalMedal) +
                t("generic.medal") +
                t(
                  "components.athleteDashboard.totalMedalBox.noSwimCertificate.pointDisplay.postfix",
                )
              : t("components.athleteDashboard.totalMedalBox.noMedalReached")}
          </Typography>
        </Box>
        <CardContent
          sx={{
            filter: swimCertificateMissing ? "blur(15px)" : "blur(0px)",
            transition: "all ease .3s",
            height: "100%",
          }}
        >
          <GenericDashboardBoxHeader>
            {t("components.athleteDashboard.totalMedalBox.header")}
          </GenericDashboardBoxHeader>
          <GenericDashboardBoxContent
            sx={{
              height: "100%",
              position: "relative",
            }}
          >
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
                    totalMedal != Medals.NONE
                      ? medalColors[totalMedal]
                      : "gray",
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
                    userSelect: "auto",
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
                    width: "75%",
                  }}
                >
                  <Typography level={"body-md"} sx={{ userSelect: "text" }}>
                    {isMedalMissing ? (
                      t(
                        "components.athleteDashboard.totalMedalBox.medalMissing",
                      )
                    ) : (
                      <>
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
                      </>
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
        </CardContent>
      </Box>
    </>
  );
};

export default AthleteTotalMedalBox;
