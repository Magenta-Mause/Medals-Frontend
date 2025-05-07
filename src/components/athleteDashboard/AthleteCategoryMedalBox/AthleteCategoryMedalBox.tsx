import { DisciplineCategories, Medals } from "@customTypes/enums";
import {
  GenericDashboardBoxContent,
  GenericDashboardBoxFooter,
  GenericDashboardBoxHeader,
} from "@components/athleteDashboard/GenericDashboardBox";
import MedalIcon from "@components/icons/MedalIcon/MedalIcon";
import { useTypedSelector } from "@stores/rootReducer";
import { PerformanceRecording } from "@customTypes/backendTypes";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { useContext } from "react";
import dayjs from "dayjs";
import {
  calculatePerformanceRecordingMedal,
  convertMedalToNumber,
} from "@utils/calculationUtil";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/joy";

const AthleteCategoryMedalBox = (props: { category: DisciplineCategories }) => {
  const { selectedUser } = useContext(AuthContext);
  const { t } = useTranslation();
  const performanceRecordings = (
    useTypedSelector(
      (state) => state.performanceRecordings.data,
    ) as PerformanceRecording[]
  )
    .filter((p) => p.athlete_id == selectedUser?.id)
    .filter((p) => dayjs(p.date_of_performance).year() == dayjs().year())
    .filter(
      (p) => p.discipline_rating_metric.discipline.category == props.category,
    );
  const medals = performanceRecordings
    .map(calculatePerformanceRecordingMedal)
    .sort((a, b) => convertMedalToNumber(b) - convertMedalToNumber(a));

  return (
    <>
      <GenericDashboardBoxHeader>
        {t("generic.category")}:{" "}
        {t("disciplines.categories." + props.category + ".label")}
      </GenericDashboardBoxHeader>
      <GenericDashboardBoxContent
        sx={{
          height: "150px",
          m: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <MedalIcon
          category={props.category}
          medalType={medals.length > 0 ? medals[0] : Medals.NONE}
          sx={{ height: "60%", aspectRatio: 1, width: "auto" }}
        />
        <Typography sx={{ p: 1, textAlign: "center" }} level={"body-lg"}>
          {t("medals." + (medals[0] ?? Medals.NONE))}
        </Typography>
      </GenericDashboardBoxContent>
      <GenericDashboardBoxFooter>
        {t("components.athleteDashboard.categoryMedalBox.thisEquals")}{" "}
        {convertMedalToNumber(medals[0])}{" "}
        {t(
          "components.athleteDashboard.categoryMedalBox.points." +
            (convertMedalToNumber(medals[0]) == 1 ? "singular" : "plural"),
        )}
      </GenericDashboardBoxFooter>
    </>
  );
};

export default AthleteCategoryMedalBox;
