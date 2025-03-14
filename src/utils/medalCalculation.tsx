import { PerformanceRecording } from "@customTypes/backendTypes";
import { Genders, Medals } from "@customTypes/enums";

const calculatePerformanceRecordingMedal = (
  performanceRecording: PerformanceRecording,
) => {
  const athlete = performanceRecording.athlete;
  const metric =
    athlete.gender == Genders.FEMALE
      ? performanceRecording.discipline_rating_metric.rating_female
      : performanceRecording.discipline_rating_metric.rating_male;
  const value = performanceRecording.rating_value;
  if (performanceRecording.discipline_rating_metric.discipline.more_better) {
    if (value >= metric.gold_rating) {
      return Medals.GOLD;
    } else if (value >= metric.silver_rating) {
      return Medals.SILVER;
    } else if (value >= metric.bronze_rating) {
      return Medals.BRONZE;
    }
    return Medals.NONE;
  } else {
    if (value <= metric.gold_rating) {
      return Medals.GOLD;
    } else if (value <= metric.silver_rating) {
      return Medals.SILVER;
    } else if (value <= metric.bronze_rating) {
      return Medals.BRONZE;
    }
    return Medals.NONE;
  }
};

const convertMedalToNumber = (medal: Medals) => {
  return medal == Medals.GOLD
    ? 3
    : medal == Medals.SILVER
      ? 2
      : medal == Medals.BRONZE
        ? 1
        : 0;
};

export { calculatePerformanceRecordingMedal, convertMedalToNumber };
