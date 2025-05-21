import { useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import {
  AgeRange,
  Athlete,
  DisciplineRatingMetric,
} from "@customTypes/backendTypes";
import { Genders, UserType } from "@customTypes/enums";
import FilterComponent, {
  Filter,
} from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { useTypedSelector } from "@stores/rootReducer";
import PerformanceMetricDatagrid from "@components/datagrids/PerformanceMetricDatagrid/PerformanceMetricDatagrid";
import { InfoTooltip } from "@components/InfoTooltip/InfoTooltip";
import { calculateAge } from "@utils/calculationUtil";

const ageRangeOptions: AgeRange[] = [
  { label: "6-7", min: 6, max: 7 },
  { label: "8-9", min: 8, max: 9 },
  { label: "10-11", min: 10, max: 11 },
  { label: "12-13", min: 12, max: 13 },
  { label: "14-15", min: 14, max: 15 },
  { label: "16-17", min: 16, max: 17 },
];

const PerformanceMetricsPage = () => {
  const { selectedUser } = useContext(AuthContext);
  const { t } = useTranslation();

  const userRole = selectedUser?.type;

  const defaultFilterValues = useMemo(() => {
    const year = new Date().getFullYear().toString();
    if (selectedUser?.type === UserType.ATHLETE) {
      const athlete = selectedUser as unknown as Athlete;
      const age = calculateAge(athlete.birthdate);
      const matchingAgeRange = ageRangeOptions.find(
        (range) => age >= range.min && age <= range.max,
      );
      return {
        year,
        age: matchingAgeRange
          ? matchingAgeRange.label
          : ageRangeOptions[0].label,
        gender: athlete.gender || Genders.FEMALE,
      };
    }
    return {
      year,
      age: ageRangeOptions[0].label,
      gender: Genders.FEMALE,
    };
  }, [selectedUser]);

  const [filterValues, setFilterValues] =
    useState<Record<string, string>>(defaultFilterValues);

  useEffect(() => {
    if (selectedUser?.type === UserType.ATHLETE) {
      setFilterValues(defaultFilterValues);
    }
  }, [defaultFilterValues, selectedUser]);

  const disciplineRatingMetrics = useTypedSelector(
    (state) => state.disciplineMetrics.data,
  ) as DisciplineRatingMetric[];

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
              text={t("components.tooltip.genderDiversInfo")}
              position="top"
              iconProps={{ fontSize: "small" }}
            />
          </span>
        ),
        type: "SELECTION",
        selection: [
          { value: Genders.FEMALE, displayValue: t("genders.FEMALE") },
          { value: Genders.MALE, displayValue: t("genders.MALE") },
          { value: Genders.DIVERSE, displayValue: t("genders.DIVERSE") },
        ],
        apply: (filterParam: string) => (item: DisciplineRatingMetric) => {
          if (filterParam === Genders.FEMALE) {
            return item.rating_female !== null;
          } else if (
            filterParam === Genders.MALE ||
            filterParam === Genders.DIVERSE
          ) {
            return item.rating_male !== null;
          }
          return true;
        },
      },
    ],
    [availableYears, t],
  );

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

  const setFilter = (
    key: string,
    value: string | ((oldVal: string) => string),
  ) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: typeof value === "function" ? value(prev[key] || "") : value,
    }));
  };

  const handleResetFilters = () => {
    setFilterValues(defaultFilterValues);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography level="h2" component="h1">
        {userRole === UserType.ATHLETE
          ? t("pages.performanceMetricsPage.title.athlete")
          : t("pages.performanceMetricsPage.title.default")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <FilterComponent
          filters={filters}
          setFilter={setFilter}
          filterValues={filterValues}
        />
        {selectedUser?.type === UserType.ATHLETE && (
          <Button
            sx={{ alignSelf: "flex-end" }}
            onClick={handleResetFilters}
            disabled={filterValues == defaultFilterValues}
          >
            {t("pages.performanceMetricsPage.resetFilter")}
          </Button>
        )}
      </Box>
      <PerformanceMetricDatagrid
        groupedMetrics={groupedMetrics}
        gender={filterValues.gender as Genders}
      />
    </Box>
  );
};

export default PerformanceMetricsPage;
