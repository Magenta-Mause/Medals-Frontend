import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import GenericResponsiveDatagrid from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import MedalRatings, {
  CustomChip,
} from "@components/MedalRatings/MedalRatings";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import { DisciplineRatingMetric } from "@customTypes/backendTypes";
import { DisciplineCategories, Genders } from "@customTypes/enums";
import { InfoTooltip } from "@components/Tooltip/InfoTooltip";
import { DisciplineIcons } from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";

interface PerformanceMetricDatagridProps {
  groupedMetrics: Record<string, DisciplineRatingMetric[]>;
  gender: Genders;
}

const PerformanceMetricDatagrid: React.FC<PerformanceMetricDatagridProps> = ({
  groupedMetrics,
  gender,
}) => {
  const { t } = useTranslation();

  // Define the columns for the desktop datagrid.
  const columns: Column<DisciplineRatingMetric>[] = useMemo(
    () => [
      {
        columnName: t("generic.discipline"),
        columnMapping: (metric: DisciplineRatingMetric) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>{metric.discipline.name}</Typography>
            {metric.discipline.description && (
              <InfoTooltip
                text={metric.discipline.description}
                position="right"
                iconProps={{ sx: { ml: 1 }, fontSize: "small" }}
              />
            )}
          </Box>
        ),
        size: "m",
      },
      {
        columnName: t("medals.GOLD"),
        columnMapping: (metric: DisciplineRatingMetric) => {
          const goldRating =
            gender === Genders.FEMALE
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
            gender === Genders.FEMALE
              ? (metric.rating_female?.silver_rating ?? "–")
              : (metric.rating_male?.silver_rating ?? "–");
          const unit = metric.discipline.unit;
          return (
            <CustomChip value={silverRating} color="#C0C0C0" unit={unit} />
          );
        },
        size: "s",
      },
      {
        columnName: t("medals.BRONZE"),
        columnMapping: (metric: DisciplineRatingMetric) => {
          const bronzeRating =
            gender === Genders.FEMALE
              ? (metric.rating_female?.bronze_rating ?? "–")
              : (metric.rating_male?.bronze_rating ?? "–");
          const unit = metric.discipline.unit;
          return (
            <CustomChip value={bronzeRating} color="#CD7F32" unit={unit} />
          );
        },
        size: "s",
      },
    ],
    [gender, t],
  );

  // Define mobile rendering configuration.
  const mobileRendering: MobileTableRendering<DisciplineRatingMetric> = useMemo(
    () => ({
      h1: (metric: DisciplineRatingMetric) => (
        <Typography>{metric.discipline.name}</Typography>
      ),
      h2: (metric: DisciplineRatingMetric) => (
        <Typography>{metric.discipline.description}</Typography>
      ),
      h3: (metric: DisciplineRatingMetric) => (
        <MedalRatings metric={metric} selectedGender={gender} />
      ),
    }),
    [gender],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
            <Box
              sx={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyItems: "flex-start",
                gap: { md: 5, xs: 1.5 },
                pl: { md: 2, xs: 1 },
                width: "100%",
                "> svg": {
                  height: "30px",
                  width: "30px",
                },
              }}
            >
              {DisciplineIcons[category as DisciplineCategories]({})}
              <Typography level="h3">
                {t(`disciplines.categories.${category}.label`)}
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

export default PerformanceMetricDatagrid;
