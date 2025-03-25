import { AgeRange, DisciplineRatingMetric } from "@customTypes/backendTypes";
import { DisciplineCategories, Genders } from "@customTypes/enums";
import { DisciplineIcons } from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import {
  Box,
  Typography,
  Select,
  Option,
  Button,
  ToggleButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import useApi from "@hooks/useApi";
import GenericResponsiveDatagrid from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import MedalRatings, { CustomChip } from "@components/MedalRatings/MedalRatings";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";

const ageRangeOptions: AgeRange[] = [
  { label: "6-7", min: 6, max: 7 },
  { label: "8-9", min: 8, max: 9 },
  { label: "10-11", min: 10, max: 11 },
  { label: "12-13", min: 12, max: 13 },
  { label: "14-15", min: 14, max: 15 },
  { label: "16-17", min: 16, max: 17 },
];

const PerformanceMetricsPage = () => {
  // Optionally available from Redux.
  const disciplines = useTypedSelector((state) => state.disciplines.data) as any[];

  // Local state for selected year, gender, metrics and age range.
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedGender, setSelectedGender] = useState<Genders>(Genders.MALE);
  const [disciplineRatingMetrics, setDisciplineRatingMetrics] = useState<DisciplineRatingMetric[]>([]);
  const [selectedAgeRange, setSelectedAgeRange] = useState<AgeRange>(ageRangeOptions[0]);

  const { t } = useTranslation();
  const { getDisciplineMetrics } = useApi();

  // Fetch all discipline metrics on mount.
  useEffect(() => {
    const fetchMetrics = async () => {
      const metrics = await getDisciplineMetrics();
      if (metrics) {
        setDisciplineRatingMetrics(metrics);
      }
    };
    fetchMetrics();
  }, [getDisciplineMetrics]);

  // Calculate available years from the data using the 'valid_in' field.
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    disciplineRatingMetrics.forEach((metric) => {
      if (metric.valid_in) {
        yearsSet.add(metric.valid_in);
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [disciplineRatingMetrics]);

  // Update selectedYear if it's not among available years.
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Filter metrics by the selected valid_in year and age range.
  const filteredMetrics = useMemo(() => {
    return disciplineRatingMetrics.filter((metric) => {
      const isYearMatch = metric.valid_in === selectedYear;
      const isAgeMatch = metric.start_age <= selectedAgeRange.min && metric.end_age >= selectedAgeRange.max;
      return isYearMatch && isAgeMatch;
    });
  }, [disciplineRatingMetrics, selectedYear, selectedAgeRange]);

  // Group the filtered metrics by discipline category.
  const groupedMetrics = useMemo(() => {
    return filteredMetrics.reduce((acc, metric) => {
      const category = metric.discipline.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(metric);
      return acc;
    }, {} as Record<string, DisciplineRatingMetric[]>);
  }, [filteredMetrics]);

  // Define the columns for the datagrid.
  const columns: Column<DisciplineRatingMetric>[] = [
    {
      columnName: t("generic.discipline"),
      columnMapping: (metric: DisciplineRatingMetric) => metric.discipline.name,
      size: "m",
    },
    {
      columnName: t("medals.GOLD"),
      columnMapping: (metric: DisciplineRatingMetric) => {
        const goldRating =
          selectedGender !== Genders.FEMALE
            ? metric.rating_male?.gold_rating ?? "–"
            : metric.rating_female?.gold_rating ?? "–";
        const unit = metric.discipline.unit;
        return <CustomChip value={goldRating} color="#FFD700" unit={unit} />;
      },
      size: "s",
    },
    {
      columnName: t("medals.SILVER"),
      columnMapping: (metric: DisciplineRatingMetric) => {
        const silverRating =
          selectedGender !== Genders.FEMALE
            ? metric.rating_male?.silver_rating ?? "–"
            : metric.rating_female?.silver_rating ?? "–";
        const unit = metric.discipline.unit;
        return <CustomChip value={silverRating} color="#C0C0C0" unit={unit} />;
      },
      size: "s",
    },
    {
      columnName: t("medals.BRONZE"),
      columnMapping: (metric: DisciplineRatingMetric) => {
        const bronzeRating =
          selectedGender !== Genders.FEMALE
            ? metric.rating_male?.bronze_rating ?? "–"
            : metric.rating_female?.bronze_rating ?? "–";
        const unit = metric.discipline.unit;
        return <CustomChip value={bronzeRating} color="#CD7F32" unit={unit} />;
      },
      size: "s",
    },
  ];

  const mobileRendering: MobileTableRendering<DisciplineRatingMetric> = {
    h1: (metric: DisciplineRatingMetric) => (
      <Typography>{metric.discipline.name}</Typography>
    ),
    h2: (metric: DisciplineRatingMetric) => (
      <MedalRatings metric={metric} selectedGender={selectedGender} />
    ),
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      <Typography level="h2" component="h1">
        {t("pages.performanceMetricsPage.title")}
      </Typography>
      {/* Year selector */}
      <Select
        value={selectedYear.toString()}
        onChange={(e, newValue) => setSelectedYear(Number(newValue))}
      >
        {availableYears.map((year) => (
          <Option key={year} value={year.toString()}>
            {year}
          </Option>
        ))}
      </Select>
      {/* Gender filter */}
      <ToggleButtonGroup
        component="div"
        color="neutral"
        value={selectedGender}
        onChange={(_e, newGender) => {
          if (newGender !== null) {
            setSelectedGender(newGender as Genders);
          }
        }}
      >
        <Button value={Genders.FEMALE} variant={selectedGender === Genders.FEMALE ? "solid" : "outlined"}>
          {t("genders." + Genders.FEMALE)}
        </Button>
        <Button value={Genders.MALE} variant={selectedGender === Genders.MALE ? "solid" : "outlined"}>
          {t("genders." + Genders.MALE)}
        </Button>
        <Button value={Genders.DIVERSE} variant={selectedGender === Genders.DIVERSE ? "solid" : "outlined"}>
          {t("genders." + Genders.DIVERSE)}
        </Button>
      </ToggleButtonGroup>
      {/* Age range filter */}
      <Select
        value={selectedAgeRange.label}
        onChange={(_e, newValue) => {
          const range = ageRangeOptions.find((option) => option.label === newValue);
          if (range) setSelectedAgeRange(range);
        }}
      >
        {ageRangeOptions.map((option) => (
          <Option key={option.label} value={option.label}>
            {option.label}
          </Option>
        ))}
      </Select>
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
