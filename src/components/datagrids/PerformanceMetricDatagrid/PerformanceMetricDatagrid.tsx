import React, { useMemo, useCallback } from "react";
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
import MedalRatings from "@components/MedalRatings/MedalRatings";
import { CustomChip } from "@components/MedalRatings/MedalRatings";
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

  const renderMedalChip = useCallback(
    (
      metric: DisciplineRatingMetric,
      medal: "gold" | "silver" | "bronze",
      chipColor: string,
    ) => {
      const ratingKey = `${medal}_rating` as
        | "gold_rating"
        | "silver_rating"
        | "bronze_rating";
      const ratingValue =
        gender === Genders.FEMALE
          ? metric.rating_female?.[ratingKey]
          : metric.rating_male?.[ratingKey];
      return (
        <CustomChip
          value={ratingValue ?? "–"}
          color={chipColor}
          unit={metric.discipline.unit || ""}
        />
      );
    },
    [gender],
  );

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
        columnMapping: (metric: DisciplineRatingMetric) =>
          renderMedalChip(metric, "gold", "#FFD700"),
        size: "s",
      },
      {
        columnName: t("medals.SILVER"),
        columnMapping: (metric: DisciplineRatingMetric) =>
          renderMedalChip(metric, "silver", "#C0C0C0"),
        size: "s",
      },
      {
        columnName: t("medals.BRONZE"),
        columnMapping: (metric: DisciplineRatingMetric) =>
          renderMedalChip(metric, "bronze", "#CD7F32"),
        size: "s",
      },
    ],
    [renderMedalChip, t],
  );

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
