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
  [MetricUnits.POINTS]: "p.",
};

const unitAbbreviation = (unit: string): string => UNIT_MAP[unit] || unit;

const hexToRGBA = (hex: string, alpha: number) => {
  if (hex.startsWith("#") && hex.length === 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
};

export const CustomChip = ({ value, color, unit }: CustomChipProps) => {
  const { i18n } = useTranslation();
  let displayValue = value;

  if (typeof value === "number") {
    const locale = i18n.language;
    if (unit) {
      const abbrev = unitAbbreviation(unit);
      if (abbrev === "s" && value >= 60) {
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        displayValue =
          seconds !== 0 ? `${minutes} min ${seconds} s` : `${minutes} min`;
      } else {
        displayValue = `${value.toLocaleString(locale)} ${abbrev}`;
      }
    } else {
      displayValue = value.toLocaleString(locale);
    }
  }

  return (
    <Chip
      variant="soft"
      size="sm"
      sx={{
        backgroundColor: hexToRGBA(color, 0.6),
        color: "#000",
        fontWeight: "bold",
        minWidth: "80px",
        textAlign: "center",
      }}
    >
      {displayValue}
    </Chip>
  );
};

const MedalRatings = ({ metric, selectedGender }: MedalRatingsProps) => {
  const { t } = useTranslation();
  const unit = metric.discipline.unit || "";

  const getRating = (ratingMale: any, ratingFemale: any) =>
    selectedGender === Genders.w ? ratingFemale : ratingMale;

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
          <CustomChip
            value={medalRating.value}
            color={medalRating.color}
            unit={unit}
          />
          <Typography level="body-sm">{medalRating.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default MedalRatings;
