import { Discipline, PerformanceRecording } from "@customTypes/backendTypes";
import { DisciplineCategories, Genders, Medals } from "@customTypes/enums";

const medalMinPoints = {
  [Medals.GOLD]: 11,
  [Medals.SILVER]: 8,
  [Medals.BRONZE]: 4,
  [Medals.NONE]: 0,
};

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

const medalPoints = {
  [Medals.GOLD]: 3,
  [Medals.SILVER]: 2,
  [Medals.BRONZE]: 1,
  [Medals.NONE]: 0,
};

const convertNumberToMedal = (points: number) => {
  return (
    Object.values(medalPoints).includes(points)
      ? Object.entries(medalPoints).filter((entry) => entry[1] == points)[0][0]
      : Medals.NONE
  ) as Medals;
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

const calculateBestMedalPerCategoryFromPerformanceRecordings = (
  performanceRecordings: PerformanceRecording[],
) => {
  const bestMedalPerCategory: Record<DisciplineCategories, Medals> = {
    SPEED: Medals.NONE,
    STRENGTH: Medals.NONE,
    COORDINATION: Medals.NONE,
    ENDURANCE: Medals.NONE,
  };

  performanceRecordings.forEach((p) => {
    const category = p.discipline_rating_metric.discipline.category;
    const achievedMedal = calculatePerformanceRecordingMedal(p);
    if (
      convertMedalToNumber(bestMedalPerCategory[category]) <
      convertMedalToNumber(achievedMedal)
    ) {
      bestMedalPerCategory[category] = achievedMedal;
    }
  });

  return bestMedalPerCategory;
};

const calculateTotalPointsFromPerformanceRecordings = (
  performanceRecordings: PerformanceRecording[],
) => {
  const bestMedalPerCategory: Record<DisciplineCategories, Medals> =
    calculateBestMedalPerCategoryFromPerformanceRecordings(
      performanceRecordings,
    );

  return Object.keys(bestMedalPerCategory)
    .map((category) => bestMedalPerCategory[category as DisciplineCategories])
    .reduce((a, b) => a + convertMedalToNumber(b), 0);
};

const calculateTotalMedalFromPerformanceRecordings = (
  performanceRecordings: PerformanceRecording[],
) => {
  const totalSum = calculateTotalPointsFromPerformanceRecordings(
    performanceRecordings,
  );
  const bestMedalPerCategory: Record<DisciplineCategories, Medals> =
    calculateBestMedalPerCategoryFromPerformanceRecordings(
      performanceRecordings,
    );

  if (Object.values(bestMedalPerCategory).includes(Medals.NONE)) {
    return Medals.NONE;
  }
  return calculateTotalMedalFromAchievedPoints(totalSum);
};

const calculateTotalMedalFromAchievedPoints = (totalSum: number) => {
  return totalSum >= medalMinPoints[Medals.GOLD]
    ? Medals.GOLD
    : totalSum >= medalMinPoints[Medals.SILVER]
      ? Medals.SILVER
      : totalSum >= medalMinPoints[Medals.BRONZE]
        ? Medals.BRONZE
        : Medals.NONE;
};

export {
  calculatePerformanceRecordingMedal,
  convertMedalToNumber,
  convertNumberToMedal,
  getBestPerformanceRecording,
  calculateAge,
  medalMinPoints,
  calculateBestMedalPerCategoryFromPerformanceRecordings,
  calculateTotalMedalFromPerformanceRecordings,
  calculateTotalMedalFromAchievedPoints,
  calculateTotalPointsFromPerformanceRecordings,
};
