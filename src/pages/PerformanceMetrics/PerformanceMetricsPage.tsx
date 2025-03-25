import { DisciplineRatingMetric } from "@customTypes/backendTypes";
import { DisciplineCategories } from "@customTypes/enums";
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
import { useState, useEffect, useMemo, ReactNode } from "react";
import useApi from "@hooks/useApi";
import FullScreenTable, { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import { Key } from "react";
import { GiJumpingRope } from "react-icons/gi";
import { FaRunning, FaStopwatch } from "react-icons/fa";
import { BiDumbbell } from "react-icons/bi";

// Map discipline categories to icons.
const DisciplineIcons: Record<DisciplineCategories, ReactNode> = {
  COORDINATION: <GiJumpingRope />,
  ENDURANCE: <FaRunning />,
  SPEED: <FaStopwatch />,
  STRENGTH: <BiDumbbell />,
};

interface AgeRange {
  label: string;
  min: number;
  max: number;
}

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

  // Local state for selected year, gender, discipline metrics, and selection.
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedGender, setSelectedGender] = useState<"male" | "female">("male");
  const [disciplineRatingMetrics, setDisciplineRatingMetrics] = useState<DisciplineRatingMetric[]>([]);
  const [selected, setSelected] = useState<Key[]>([]);

  // Age range filter: using a dropdown with predefined age ranges.
  const [selectedAgeRange, setSelectedAgeRange] = useState<AgeRange>(ageRangeOptions[0]);

  const { t } = useTranslation();
  const { getDisciplineMetrics } = useApi();

  // Fetch all discipline metrics on mount (no need to refetch on year change).
  useEffect(() => {
    const fetchMetrics = async () => {
      const metrics = await getDisciplineMetrics();
      if (metrics) {
        setDisciplineRatingMetrics(metrics);
      }
    };
    fetchMetrics();
  }, [getDisciplineMetrics]);

  // Create an array of recent years (e.g., last 10 years).
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Filter metrics by the selected year and age range.
  const filteredMetrics = useMemo(() => {
    return disciplineRatingMetrics.filter((metric) => {
      // Ensure metric is for the selected year (assumes metric.year exists).
      const isYearMatch = metric.valid_in === selectedYear;
      // Check if the metric's valid age range fully covers the selected age range.
      const isAgeMatch = metric.start_age <= selectedAgeRange.min && metric.end_age >= selectedAgeRange.max;
      return isYearMatch && isAgeMatch;
    });
  }, [disciplineRatingMetrics, selectedYear, selectedAgeRange]);

  // Group the filtered metrics by discipline category.
  const groupedMetrics = filteredMetrics.reduce((acc, metric) => {
    const category = metric.discipline.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(metric);
    return acc;
  }, {} as Record<string, DisciplineRatingMetric[]>);

  // Define table columns using your FullScreenTable Column interface.
  const columns: Column<DisciplineRatingMetric>[] = [
    {
      columnName: "Discipline",
      columnMapping: (metric: DisciplineRatingMetric) => metric.discipline.name,
      size: "m",
    },
    {
      columnName: "Gold",
      columnMapping: (metric: DisciplineRatingMetric) =>
        selectedGender === "male"
          ? metric.rating_male?.gold_rating ?? "–"
          : metric.rating_female?.gold_rating ?? "–",
      size: "s",
    },
    {
      columnName: "Silver",
      columnMapping: (metric: DisciplineRatingMetric) =>
        selectedGender === "male"
          ? metric.rating_male?.silver_rating ?? "–"
          : metric.rating_female?.silver_rating ?? "–",
      size: "s",
    },
    {
      columnName: "Bronze",
      columnMapping: (metric: DisciplineRatingMetric) =>
        selectedGender === "male"
          ? metric.rating_male?.bronze_rating ?? "–"
          : metric.rating_female?.bronze_rating ?? "–",
      size: "s",
    },
  ];

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
        {yearOptions.map((year) => (
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
            setSelectedGender(newGender);
          }
        }}
      >
        <Button value="male" variant={selectedGender === "male" ? "solid" : "outlined"}>
          Male
        </Button>
        <Button value="female" variant={selectedGender === "female" ? "solid" : "outlined"}>
          Female
        </Button>
      </ToggleButtonGroup>
      {/* Age range filter drop-down */}
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
      {/* Grouped metrics by discipline category */}
      {Object.entries(groupedMetrics).map(([category, metrics]) => (
        <Accordion key={category} defaultExpanded>
          <AccordionSummary
            sx={{
              padding: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {DisciplineIcons[category as DisciplineCategories]}
              <Typography level="h3">
                {t("disciplines.categories." + category + ".label")}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <FullScreenTable<DisciplineRatingMetric>
              selected={selected}
              setSelected={setSelected}
              renderedPage={metrics}
              allItems={metrics}
              columns={columns}
              keyOf={(metric: DisciplineRatingMetric) => metric.id}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default PerformanceMetricsPage;
