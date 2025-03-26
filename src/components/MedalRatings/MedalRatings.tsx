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

const UNIT_MAP: Record<string, string> = {
  [MetricUnits.SECONDS]: "s",
  [MetricUnits.METERS]: "m",
  [MetricUnits.POINTS]: "p",
};

const unitAbbreviation = (unit: string): string => UNIT_MAP[unit] || unit;

export const CustomChip = ({ value, color, unit }: CustomChipProps) => {
  let displayValue = value;

  if (typeof value === "number" && unit) {
    const abbrev = unitAbbreviation(unit);
    displayValue =
      abbrev === "s" && value >= 60
        ? `${Math.floor(value / 60)}m ${value % 60}s`
        : `${value}${abbrev}`;
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
  const unit = metric.discipline.unit || "";

  const getRating = (ratingMale: any, ratingFemale: any) =>
    selectedGender == Genders.FEMALE ? ratingFemale: ratingMale;

  const goldRating =
    getRating(
      metric.rating_male?.gold_rating,
      metric.rating_female?.gold_rating,
    ) ?? "–";
  const silverRating =
    getRating(
      metric.rating_male?.silver_rating,
      metric.rating_female?.silver_rating,
    ) ?? "–";
  const bronzeRating =
    getRating(
      metric.rating_male?.bronze_rating,
      metric.rating_female?.bronze_rating,
    ) ?? "–";

  const medalsRating = [
    { label: t("medals.GOLD"), value: goldRating, color: "#FFD700" },
    { label: t("medals.SILVER"), value: silverRating, color: "#C0C0C0" },
    { label: t("medals.BRONZE"), value: bronzeRating, color: "#CD7F32" },
  ];

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      {medalsRating.map((medalRating, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography level="body-sm">{medalRating.label}</Typography>
          <CustomChip
            value={medalRating.value}
            color={medalRating.color}
            unit={unit}
          />
        </Box>
      ))}
    </Box>
  );
};

export default MedalRatings;
