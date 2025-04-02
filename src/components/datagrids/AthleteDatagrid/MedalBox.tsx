import React from "react";
import { Box } from "@mui/joy";
import { Athlete, PerformanceRecording } from "@customTypes/backendTypes";
import { DisciplineCategories, Medals } from "@customTypes/enums";
import {
  calculatePerformanceRecordingMedal,
  convertMedalToNumber,
} from "@utils/calculationUtil";
import MedalIcon from "@components/icons/MedalIcon/MedalIcon";

interface MedalBoxProps {
  athlete: Athlete;
  performanceRecordings: PerformanceRecording[];
  sx?: any;
  iconSize?: string;
}

const MedalBox = ({
  athlete,
  performanceRecordings,
  sx,
  iconSize,
}: MedalBoxProps) => {
  const performanceRecordingsOfAthlete = performanceRecordings.filter(
    (p) => p.athlete_id === athlete.id,
  );

  return (
    <Box sx={{ display: "flex", gap: "10px", justifyContent: "left", ...sx }}>
      {Object.values(DisciplineCategories).map((category) => {
        const recordingsByCategory = performanceRecordingsOfAthlete.filter(
          (p) => p.discipline_rating_metric.discipline.category === category,
        );
        const bestMedal = recordingsByCategory
          .map((p) => calculatePerformanceRecordingMedal(p))
          .sort((m) => convertMedalToNumber(m))
          .reverse()[0];
        return (
          <MedalIcon
            category={category}
            medalType={bestMedal ?? Medals.NONE}
            key={`${athlete.id}-${category}`}
            iconSize={iconSize}
          />
        );
      })}
    </Box>
  );
};

export default MedalBox;
