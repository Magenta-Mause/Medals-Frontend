import { Box } from "@mui/joy";
import { Athlete, PerformanceRecording } from "@customTypes/backendTypes";
import { DisciplineCategories, Medals } from "@customTypes/enums";
import {
  calculatePerformanceRecordingMedal,
  calculateTotalMedalFromPerformanceRecordings,
  convertMedalToNumber,
} from "@utils/calculationUtil";
import MedalIcon from "@components/icons/MedalIcon/MedalIcon";
import SwimCertificateIcon from "@components/icons/SwimCertificateIcon/SwimCertificateIcon";

export interface AchievementsBoxProps {
  athlete: Athlete;
  performanceRecordings: PerformanceRecording[];
  sx?: any;
  selectedYear: number;
}

const AchievementsBox = ({
  athlete,
  performanceRecordings,
  sx,
  selectedYear,
}: AchievementsBoxProps) => {
  const performanceRecordingsOfAthlete = performanceRecordings.filter(
    (p) =>
      p.athlete_id === athlete.id &&
      new Date(p.date_of_performance).getFullYear() === selectedYear,
  );
  const totalMedal = calculateTotalMedalFromPerformanceRecordings(
    performanceRecordingsOfAthlete,
  );

  return (
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "left",
        ...sx,
      }}
    >
      <MedalIcon medalType={totalMedal} />
      {Object.values(DisciplineCategories).map((category) => {
        const recordingsByCategory = performanceRecordingsOfAthlete.filter(
          (p) => p.discipline_rating_metric.discipline.category === category,
        );
        const bestMedal = recordingsByCategory
          .map((p) => calculatePerformanceRecordingMedal(p))
          .sort((a, b) => convertMedalToNumber(b) - convertMedalToNumber(a))[0];
        return (
          <MedalIcon
            category={category}
            medalType={bestMedal ?? Medals.NONE}
            key={`${athlete.id}-${category}`}
          />
        );
      })}
      <SwimCertificateIcon achieved={!!athlete.swimming_certificate} />
    </Box>
  );
};

export default AchievementsBox;
