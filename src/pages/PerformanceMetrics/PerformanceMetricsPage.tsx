import { Discipline, DisciplineRatingMetric } from "@customTypes/backendTypes";
import { Box, Typography, Select, Option } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import useApi from "@hooks/useApi";

const PerformanceMetricsPage = () => {
  // You already have disciplines in Redux
  const disciplines = useTypedSelector(
    (state) => state.disciplines.data,
  ) as Discipline[];

  // Local state for the selected year and discipline metrics
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [disciplineRatingMetrics, setDisciplineRatingMetrics] = useState<DisciplineRatingMetric[]>([]);
  const { t } = useTranslation();

  // Get the API function to fetch discipline metrics
  const { getDisciplineMetrics } = useApi();

  // Fetch the metrics when the selected year changes
  useEffect(() => {
    const fetchMetrics = async () => {
      const metrics = await getDisciplineMetrics(selectedYear);
      if (metrics) {
        setDisciplineRatingMetrics(metrics);
      }
    };
    fetchMetrics();
  }, [selectedYear, getDisciplineMetrics]);

  // Create an array of recent years for the dropdown (e.g., last 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
      }}
    >
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
      {/* Display discipline metrics as JSON */}
      <Box
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "4px",
          backgroundColor: "background.body",
          overflowX: "auto",
        }}
      >
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {JSON.stringify(disciplineRatingMetrics, null, 2)}
        </pre>
      </Box>
    </Box>
  );
};

export default PerformanceMetricsPage;
