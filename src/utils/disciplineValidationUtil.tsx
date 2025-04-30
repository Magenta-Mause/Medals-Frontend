import {
  Discipline,
  DisciplineRatingMetric,
  Athlete,
} from "@customTypes/backendTypes";

const isDisciplineInvalid = (
  discipline: Discipline | null,
  athlete: Athlete | null,
  selectedYear: number | undefined,
  disciplineRatingMetrics: DisciplineRatingMetric[],
): boolean => {
  if (!selectedYear || !discipline || !athlete) {
    return false;
  }

  const age =
    selectedYear - new Date(Date.parse(athlete.birthdate)).getFullYear();

  return (
    disciplineRatingMetrics.filter(
      (metric) =>
        metric.discipline.id == discipline.id &&
        metric.end_age >= age &&
        metric.start_age <= age &&
        metric.valid_in == selectedYear &&
        (athlete.gender === "FEMALE"
          ? metric.rating_female != null
          : metric.rating_male != null),
    ).length <= 0
  );
};

export { isDisciplineInvalid };
