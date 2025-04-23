import { Discipline, PerformanceRecording } from "@customTypes/backendTypes";
import { Genders, Medals } from "@customTypes/enums";

const calculatePerformanceRecordingMedal = (
  performanceRecording: PerformanceRecording,
) => {
  const athlete = performanceRecording.athlete;
  const metric =
    athlete.gender == Genders.FEMALE
      ? performanceRecording.discipline_rating_metric.rating_female
      : performanceRecording.discipline_rating_metric.rating_male;
  if (!metric) {
    return Medals.NONE;
  }
  const value = performanceRecording.rating_value;
  if (performanceRecording.discipline_rating_metric.discipline.is_more_better) {
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

const getBestPerformanceRecording = (
  performanceRecordings: PerformanceRecording[],
  discipline: Discipline,
) => {
  return performanceRecordings.sort(
    discipline.is_more_better
      ? (a, b) => b.rating_value - a.rating_value
      : (a, b) => a.rating_value - b.rating_value,
  )[0];
};

// Helper function to calculate the age that will be reached in the current year.
const calculateAge = (birthdate: string): number => {
  const birth = new Date(birthdate);
  const currentYear = new Date().getFullYear();
  return currentYear - birth.getFullYear();
};

const arraysEqual = (a: any[], b: any[]) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export {
  calculatePerformanceRecordingMedal,
  convertMedalToNumber,
  getBestPerformanceRecording,
  calculateAge,
  arraysEqual,
};
