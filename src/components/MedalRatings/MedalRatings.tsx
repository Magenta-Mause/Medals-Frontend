import { Box, Chip, Typography } from "@mui/joy";
import { DisciplineRatingMetric } from "@customTypes/backendTypes";
import { Genders, MetricUnits } from "@customTypes/enums";
import { useTranslation } from "react-i18next";

interface MedalRatingsProps {
  metric: DisciplineRatingMetric;
  selectedGender: Genders;
}

interface CustomChipProps {
  value: number | string;
  color: string;
  unit?: string;
}

/**
 * Maps full unit strings to abbreviations using the MetricUnits enum.
 */
const unitAbbreviation = (unit: string): string => {
  if (unit === MetricUnits.SECONDS) {
    return "s";
  } else if (unit === MetricUnits.METERS) {
    return "m";
  } else if (unit === MetricUnits.POINTS) {
    return "p";
  }
  return unit;
};

/**
 * A generic chip component that displays a number (plus an optional unit).
 * - If the unit (after abbreviation) is "s" (seconds) and the number is 60 or more,
 *   it recalculates to show minutes and seconds.
 * - Otherwise, it appends the abbreviated unit to the number.
 */
export const CustomChip = ({ value, color, unit }: CustomChipProps) => {
  let displayValue = value;

  if (typeof value === "number" && unit) {
    const abbrev = unitAbbreviation(unit);
    if (abbrev === "s") {
      // If seconds are 60 or more, recalc as minutes and seconds
      if (value >= 60) {
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        displayValue = `${minutes}m ${seconds}s`;
      } else {
        displayValue = `${value}s`;
      }
    } else {
      // For meters or points, append the unit abbreviation.
      displayValue = `${value}${abbrev}`;
    }
  }

  return (
    <Chip
      variant="soft"
      size="sm"
      sx={{ backgroundColor: color, color: "#000", fontWeight: "bold" }}
    >
      {displayValue}
    </Chip>
  );
};

const MedalRatings = ({ metric, selectedGender }: MedalRatingsProps) => {
  const { t } = useTranslation();

  // Use the full unit string (e.g. "seconds", "meters", "points")
  const unit = metric.discipline.unit || "";

  const goldRating =
    selectedGender !== Genders.FEMALE
      ? (metric.rating_male?.gold_rating ?? "–")
      : (metric.rating_female?.gold_rating ?? "–");
  const silverRating =
    selectedGender !== Genders.FEMALE
      ? (metric.rating_male?.silver_rating ?? "–")
      : (metric.rating_female?.silver_rating ?? "–");
  const bronzeRating =
    selectedGender !== Genders.FEMALE
      ? (metric.rating_male?.bronze_rating ?? "–")
      : (metric.rating_female?.bronze_rating ?? "–");

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography level="body-sm">{t("medals.GOLD")}</Typography>
        <CustomChip value={goldRating} color="#FFD700" unit={unit} />
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography level="body-sm">{t("medals.SILVER")}</Typography>
        <CustomChip value={silverRating} color="#C0C0C0" unit={unit} />
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography level="body-sm">{t("medals.BRONZE")}</Typography>
        <CustomChip value={bronzeRating} color="#CD7F32" unit={unit} />
      </Box>
    </Box>
  );
};

export default MedalRatings;
