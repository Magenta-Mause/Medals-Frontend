import { FormControl, FormLabel, Select, Option } from "@mui/joy";
import { DisciplineRatingMetric } from "@customTypes/backendTypes";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface YearSelectorProps {
  selectedYear: number;
  setYear: (year: number) => void;
  disciplineRatingMetrics: DisciplineRatingMetric[];
}

const YearSelector = ({
  selectedYear,
  setYear,
  disciplineRatingMetrics,
}: YearSelectorProps) => {
  const { t } = useTranslation();

  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    disciplineRatingMetrics.forEach((metric) => {
      if (metric.valid_in) {
        yearsSet.add(metric.valid_in);
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [disciplineRatingMetrics]);

  return (
    <FormControl size="sm">
      <FormLabel>{t("pages.performanceMetricsPage.filters.year")}</FormLabel>
      <Select
        value={selectedYear.toString()}
        size="sm"
        sx={{ minHeight: "35px", width: "80px" }}
        onChange={(_, newValue) => {
          if (newValue) {
            setYear(Number(newValue));
          }
        }}
      >
        {availableYears.map((year) => (
          <Option key={year} value={year.toString()}>
            {year}
          </Option>
        ))}
      </Select>
    </FormControl>
  );
};

export default YearSelector;
