import { AgeRange, DisciplineRatingMetric } from "@customTypes/backendTypes";
import { DisciplineCategories, Genders } from "@customTypes/enums";
import { DisciplineIcons } from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import useApi from "@hooks/useApi";
import GenericResponsiveDatagrid from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import MedalRatings, {
  CustomChip,
} from "@components/MedalRatings/MedalRatings";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import FilterComponent, {
  Filter,
} from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Options for age range filtering.
const ageRangeOptions: AgeRange[] = [
  { label: "6-7", min: 6, max: 7 },
  { label: "8-9", min: 8, max: 9 },
  { label: "10-11", min: 10, max: 11 },
  { label: "12-13", min: 12, max: 13 },
  { label: "14-15", min: 14, max: 15 },
  { label: "16-17", min: 16, max: 17 },
];

const PerformanceMetricsPage = () => {
  // Metrics state.
  const [disciplineRatingMetrics, setDisciplineRatingMetrics] = useState<
    DisciplineRatingMetric[]
  >([]);
  // Remove separate gender ToggleButtonGroup and include gender in FilterComponent.
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    year: new Date().getFullYear().toString(),
    age: ageRangeOptions[0].label,
    gender: Genders.FEMALE,
  });

  const { t } = useTranslation();
  const { getDisciplineMetrics } = useApi();

  // Fetch metrics on mount.
  useEffect(() => {
    const fetchMetrics = async () => {
      const metrics = await getDisciplineMetrics();
      if (metrics) {
        setDisciplineRatingMetrics(metrics);
      }
    };
    fetchMetrics();
  }, [getDisciplineMetrics]);

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

  // Define filters for year, age group, and gender.
  const filters: Filter<DisciplineRatingMetric>[] = [
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
        const selectedAge = ageRangeOptions.find((opt) => opt.label === filterParam);
        if (!selectedAge) return true;
        return item.start_age <= selectedAge.min && item.end_age >= selectedAge.max;
      },
    },
    {
      name: "gender",
      label: t("pages.performanceMetricsPage.filters.gender"),
      type: "SELECTION",
      selection: [t("genders.FEMALE"), t("genders.MALE"), t("genders.DIVERSE")],
      apply: (filterParam: string) => (item: DisciplineRatingMetric) => {
        if (filterParam === Genders.FEMALE) {
          return item.rating_female !== null;
        } else if (filterParam === Genders.MALE || filterParam === Genders.DIVERSE) {
          return item.rating_male !== null;
        }
        return true;
      },
    },
  ];

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
    return finalFilteredMetrics.reduce((acc, metric) => {
      const category = metric.discipline.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(metric);
      return acc;
    }, {} as Record<string, DisciplineRatingMetric[]>);
  }, [finalFilteredMetrics]);

  // Define the columns for the desktop datagrid.
  const columns: Column<DisciplineRatingMetric>[] = [
    {
      columnName: t("generic.discipline"),
      columnMapping: (metric: DisciplineRatingMetric) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography>{metric.discipline.name}</Typography>
          {metric.discipline.description && (
            <Tooltip title={metric.discipline.description}>
              <InfoOutlinedIcon sx={{ ml: 1 }} fontSize="small" />
            </Tooltip>
          )}
        </Box>
      ),
      size: "m",
    },
    {
      columnName: t("medals.GOLD"),
      columnMapping: (metric: DisciplineRatingMetric) => {
        const goldRating =
          filterValues.gender === Genders.FEMALE
            ? (metric.rating_female?.gold_rating ?? "–")
            : (metric.rating_male?.gold_rating ?? "–");
        const unit = metric.discipline.unit;
        return <CustomChip value={goldRating} color="#FFD700" unit={unit} />;
      },
      size: "s",
    },
    {
      columnName: t("medals.SILVER"),
      columnMapping: (metric: DisciplineRatingMetric) => {
        const silverRating =
          filterValues.gender === Genders.FEMALE
            ? (metric.rating_female?.silver_rating ?? "–")
            : (metric.rating_male?.silver_rating ?? "–");
        const unit = metric.discipline.unit;
        return <CustomChip value={silverRating} color="#C0C0C0" unit={unit} />;
      },
      size: "s",
    },
    {
      columnName: t("medals.BRONZE"),
      columnMapping: (metric: DisciplineRatingMetric) => {
        const bronzeRating =
          filterValues.gender === Genders.FEMALE
            ? (metric.rating_female?.bronze_rating ?? "–")
            : (metric.rating_male?.bronze_rating ?? "–");
        const unit = metric.discipline.unit;
        return <CustomChip value={bronzeRating} color="#CD7F32" unit={unit} />;
      },
      size: "s",
    },
  ];

  // Define mobile rendering configuration.
  const mobileRendering: MobileTableRendering<DisciplineRatingMetric> = {
    h1: (metric: DisciplineRatingMetric) => (
      <Typography>{metric.discipline.name}</Typography>
    ),
    h2: (metric: DisciplineRatingMetric) => (
      <Typography>{metric.discipline.description}</Typography>
    ),
    h3: (metric: DisciplineRatingMetric) => (
      <MedalRatings
        metric={metric}
        selectedGender={filterValues.gender as Genders}
      />
    ),
  };

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
      {/* Render the FilterComponent for Year, Age Group, and Gender */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FilterComponent
          filters={filters}
          setFilter={setFilter}
          filterValues={filterValues}
        />
      </Box>
      {/* Render an accordion per discipline category */}
      {Object.entries(groupedMetrics).map(([category, metrics]) => (
        <Accordion
          key={category}
          defaultExpanded
          sx={(theme) => ({
            background: "rgba(0, 0, 0, 0.05)",
            padding: 1,
            borderRadius: 10,
            [theme.getColorSchemeSelector("dark")]: {
              background: "rgba(255, 255, 255, 0.08)",
            },
          })}
        >
          <AccordionSummary
            sx={{
              marginY: 1,
              borderRadius: 25,
              gap: { md: 3, xs: 1 },
            }}
            slotProps={{ button: { sx: { borderRadius: 10 } } }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {DisciplineIcons[category as DisciplineCategories]({})}
              <Typography level="h3">
                {t("disciplines.categories." + category + ".label")}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <GenericResponsiveDatagrid<DisciplineRatingMetric>
              data={metrics}
              columns={columns}
              keyOf={(metric) => metric.id}
              isLoading={false}
              mobileRendering={mobileRendering}
              disablePaging={true}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default PerformanceMetricsPage;
