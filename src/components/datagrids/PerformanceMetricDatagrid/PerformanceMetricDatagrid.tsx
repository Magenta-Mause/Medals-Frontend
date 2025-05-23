import React, { useCallback, useMemo } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import GenericResponsiveDatagrid from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import MedalRatings, {
  CustomChip,
} from "@components/MedalRatings/MedalRatings";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import { DisciplineRatingMetric } from "@customTypes/backendTypes";
import { DisciplineCategories, Genders, Medals } from "@customTypes/enums";
import { DisciplineIcons } from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import { useMedalColors } from "@hooks/useMedalColors";

interface PerformanceMetricDatagridProps {
  groupedMetrics: Record<string, DisciplineRatingMetric[]>;
  gender: Genders;
}

export const DisciplineInfo = ({
  name,
  description,
}: {
  name: string;
  description: string | null;
}) => (
  <Box>
    <Typography>{name}</Typography>
    {description && (
      <>
        <br />
        <Typography fontSize="10px" fontStyle="italic">
          {description}
        </Typography>
      </>
    )}
  </Box>
);

const PerformanceMetricDatagrid: React.FC<PerformanceMetricDatagridProps> = ({
  groupedMetrics,
  gender,
}) => {
  const { t } = useTranslation();
  const medalColors = useMedalColors();

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
          <DisciplineInfo
            name={metric.discipline.name}
            description={metric.discipline.description}
          />
        ),
        size: "m",
      },
      {
        columnName: t("medals.GOLD"),
        columnMapping: (metric: DisciplineRatingMetric) =>
          renderMedalChip(metric, "gold", medalColors[Medals.GOLD]),
        size: "s",
      },
      {
        columnName: t("medals.SILVER"),
        columnMapping: (metric: DisciplineRatingMetric) =>
          renderMedalChip(metric, "silver", medalColors[Medals.SILVER]),
        size: "s",
      },
      {
        columnName: t("medals.BRONZE"),
        columnMapping: (metric: DisciplineRatingMetric) =>
          renderMedalChip(metric, "bronze", medalColors[Medals.BRONZE]),
        size: "s",
      },
    ],
    [renderMedalChip, t, medalColors],
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
      {Object.entries(groupedMetrics)
        .sort()
        .map(([category, metrics]) => (
          <Accordion
            key={category}
            defaultExpanded
            sx={(theme) => ({
              background: "rgba(0, 0, 0, 0.05)",
              borderRadius: 10,
              [theme.getColorSchemeSelector("dark")]: {
                background: "rgba(255, 255, 255, 0.08)",
              },
              p: 1,
            })}
          >
            <AccordionSummary
              sx={{
                marginY: 1,
                borderRadius: 25,
                gap: { md: 3, xs: 1 },
                px: 1,
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
                  width: "100%",
                  "> svg": {
                    height: "30px",
                    width: "30px",
                  },
                  p: 1,
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
