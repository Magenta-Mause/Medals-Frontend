import { AgeRange, DisciplineRatingMetric } from "@customTypes/backendTypes";
import { Genders } from "@customTypes/enums";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { Box, Typography } from "@mui/joy";
import FilterComponent, {
  Filter,
} from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { useTypedSelector } from "@stores/rootReducer";
import PerformanceMetricDatagrid from "@components/datagrids/PerformanceMetricDatagrid/PerformanceMetricDatagrid";
import { InfoTooltip } from "@components/InfoTooltip/InfoTooltip";

const ageRangeOptions: AgeRange[] = [
  { label: "6-7", min: 6, max: 7 },
  { label: "8-9", min: 8, max: 9 },
  { label: "10-11", min: 10, max: 11 },
  { label: "12-13", min: 12, max: 13 },
  { label: "14-15", min: 14, max: 15 },
  { label: "16-17", min: 16, max: 17 },
];

const PerformanceMetricsPage = () => {
  const disciplineRatingMetrics = useTypedSelector(
    (state) => state.disciplineMetrics.data,
  ) as DisciplineRatingMetric[];

  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    year: new Date().getFullYear().toString(),
    age: ageRangeOptions[0].label,
    gender: Genders.w,
  });

  const { t } = useTranslation();

  // Compute available years from metrics.
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    disciplineRatingMetrics.forEach((metric) => {
      if (metric.valid_in) {
        yearsSet.add(metric.valid_in);
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [disciplineRatingMetrics]);

  const filters = useMemo<Filter<DisciplineRatingMetric>[]>(
    () => [
      {
        name: "year",
        label: t("pages.performanceMetricsPage.filters.year"),
        type: "SELECTION",
        selection: availableYears.map((year) => year.toString()),
        apply: (filterParam: string) => (item: DisciplineRatingMetric) =>
          item.valid_in.toString() === filterParam,
      },
      {
        name: "age",
        label: t("pages.performanceMetricsPage.filters.ageGroup"),
        type: "SELECTION",
        selection: ageRangeOptions.map((opt) => opt.label),
        apply: (filterParam: string) => (item: DisciplineRatingMetric) => {
          const selectedAge = ageRangeOptions.find(
            (opt) => opt.label === filterParam,
          );
          if (!selectedAge) return true;
          return (
            item.start_age <= selectedAge.min && item.end_age >= selectedAge.max
          );
        },
      },
      {
        name: "gender",
        label: (
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            {t("pages.performanceMetricsPage.filters.gender")}
            <InfoTooltip
              text={t("pages.performanceMetricsPage.tooltips.genderDiversInfo")}
              position="top"
              iconProps={{ fontSize: "small" }}
            />
          </span>
        ),
        type: "SELECTION",
        selection: [
          { value: Genders.w, displayValue: t("genders.FEMALE") },
          { value: Genders.m, displayValue: t("genders.MALE") },
          { value: Genders.d, displayValue: t("genders.DIVERSE") },
        ],
        apply: (filterParam: string) => (item: DisciplineRatingMetric) => {
          if (filterParam === Genders.w) {
            return item.rating_female !== null;
          } else if (filterParam === Genders.m || filterParam === Genders.d) {
            return item.rating_male !== null;
          }
          return true;
        },
      },
    ],
    [availableYears, t],
  );

  // Apply all filters to the metrics.
  const finalFilteredMetrics = useMemo(() => {
    return disciplineRatingMetrics.filter((metric) => {
      return filters.every((filter) => {
        const filterVal = filterValues[filter.name];
        if (!filterVal || filterVal.trim() === "") {
          return true;
        }
        return filter.apply(filterVal)(metric);
      });
    });
  }, [disciplineRatingMetrics, filters, filterValues]);

  // Group the filtered metrics by discipline category.
  const groupedMetrics = useMemo(() => {
    return finalFilteredMetrics.reduce(
      (acc, metric) => {
        const category = metric.discipline.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(metric);
        return acc;
      },
      {} as Record<string, DisciplineRatingMetric[]>,
    );
  }, [finalFilteredMetrics]);

  // Helper to update filter values.
  const setFilter = (
    key: string,
    value: string | ((oldVal: string) => string),
  ) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: typeof value === "function" ? value(prev[key] || "") : value,
    }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      <Typography level="h2" component="h1">
        {t("pages.performanceMetricsPage.title")}
      </Typography>
      {/* Filter section */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FilterComponent
          filters={filters}
          setFilter={setFilter}
          filterValues={filterValues}
        />
      </Box>
      {/* Datagrid section */}
      <PerformanceMetricDatagrid
        groupedMetrics={groupedMetrics}
        gender={filterValues.gender as Genders}
      />
    </Box>
  );
};

export default PerformanceMetricsPage;
