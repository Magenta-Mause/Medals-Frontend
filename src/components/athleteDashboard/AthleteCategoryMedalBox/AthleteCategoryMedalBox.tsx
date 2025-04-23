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
        Kategorie: {t("disciplines.categories." + props.category + ".label")}
      </GenericDashboardBoxHeader>
      <GenericDashboardBoxContent
        sx={{
          height: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MedalIcon
          category={props.category}
          medalType={medals.length > 0 ? medals[0] : Medals.NONE}
          sx={{ height: "60%", aspectRatio: 1, width: "auto" }}
        />
      </GenericDashboardBoxContent>
      <GenericDashboardBoxFooter>
        This equals to {convertMedalToNumber(medals[0])} points
      </GenericDashboardBoxFooter>
    </>
  );
};

export default AthleteCategoryMedalBox;
