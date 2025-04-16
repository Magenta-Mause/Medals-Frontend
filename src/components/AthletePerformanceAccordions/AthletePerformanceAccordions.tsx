import DisciplineDatagrid from "@components/datagrids/DisciplineDatagrid/DisciplineDatagrid";
import DisciplineDetailModal from "@components/modals/DisciplineDetailModal/DisciplineDetailModal";
import {
  Athlete,
  Discipline,
  DisciplineRatingMetric,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import { DisciplineCategories, Medals, UserType } from "@customTypes/enums";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Select,
  Typography,
  Option,
} from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GiJumpingRope } from "react-icons/gi";
import { FaRunning, FaStopwatch } from "react-icons/fa";
import { BiDumbbell } from "react-icons/bi";
import { IconType } from "react-icons";
import {
  calculatePerformanceRecordingMedal,
  convertMedalToNumber,
} from "@utils/calculationUtil";
import MedalIcon from "@components/MedalIcon/MedalIcon";
import { p } from "react-router/dist/development/fog-of-war-Ckdfl79L";

const DisciplineIcons: Record<DisciplineCategories, IconType> = {
  COORDINATION: GiJumpingRope,
  ENDURANCE: FaRunning,
  SPEED: FaStopwatch,
  STRENGTH: BiDumbbell,
};

const AthletePerformanceAccordions = (props: {
  athlete: Athlete;
  selectedUserType: UserType;
}) => {
  const performanceRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const disciplines = useTypedSelector(
    (state) => state.disciplines.data,
  ) as Discipline[];
  const { t } = useTranslation();
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>();
  const [isDisciplineOpen, setDisciplineOpen] = useState(false);
  const [achievedCategoryMedal, setAchievedCategoryMedal] = useState<Record<
    DisciplineCategories,
    Medals
  > | null>(null);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setYear] = useState(currentYear);

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

  useEffect(() => {
    const newAchievedCategoryMedal: Record<DisciplineCategories, Medals> = {
      [DisciplineCategories.COORDINATION]: Medals.NONE,
      [DisciplineCategories.ENDURANCE]: Medals.NONE,
      [DisciplineCategories.SPEED]: Medals.NONE,
      [DisciplineCategories.STRENGTH]: Medals.NONE,
    };
    disciplines.forEach((d) => {
      const bestEntry = performanceRecordings
        .filter((p) => p.athlete_id == props.athlete.id && new Date(p.date_of_performance).getFullYear() == selectedYear)
        .filter((p) => p.discipline_rating_metric.discipline.id == d.id)
        .sort(
          d.is_more_better
            ? (a, b) => b.rating_value - a.rating_value
            : (a, b) => a.rating_value - b.rating_value,
        )[0];
      if (bestEntry == undefined) {
        return;
      }
      const medal = calculatePerformanceRecordingMedal(bestEntry);
      if (
        convertMedalToNumber(medal) >
        convertMedalToNumber(newAchievedCategoryMedal[d.category])
      ) {
        newAchievedCategoryMedal[d.category] = medal;
      }
    });
    setAchievedCategoryMedal(newAchievedCategoryMedal);
  }, [performanceRecordings, disciplines, props.athlete.id, selectedYear]);

  const isDisciplineInvalid = useCallback(
      (discipline: Discipline | null) => {
        if (!selectedYear || !discipline || !props.athlete) {
          return false;
        }
        const age =
          selectedYear -
          new Date(Date.parse(props.athlete.birthdate)).getFullYear();
        return (
          disciplineRatingMetrics.filter(
            (metric) =>
              metric.discipline.id == discipline.id &&
              metric.end_age >= age &&
              metric.start_age <= age &&
              (props.athlete.gender == "FEMALE"
                ? metric.rating_female != null
                : metric.rating_male != null),
          ).length <= 0
        );
      },
      [props.athlete, selectedYear, disciplineRatingMetrics],
    );
    

  return (
    <>
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
        ))}{" "}
      </Select>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          width: "100%",
        }}
      >
        <DisciplineDetailModal
          athlete={props.athlete}
          setOpen={setDisciplineOpen}
          performanceRecordings={performanceRecordings.filter(
            (p) =>
              p.athlete_id == props.athlete.id &&
              (selectedDiscipline
                ? selectedDiscipline.id ==
                  p.discipline_rating_metric.discipline.id
                : false),
          )}
          discipline={selectedDiscipline}
          open={isDisciplineOpen}
          selectedUserType={props.selectedUserType}
        />
        {Object.values(DisciplineCategories).map(
          (category: DisciplineCategories) => (
            <Accordion
              key={category}
              sx={(theme) => {
                return {
                  background: "rgba(0, 0, 0, 0.05)",
                  padding: 1,
                  borderRadius: 10,
                  [theme.getColorSchemeSelector("dark")]: {
                    background: "rgba(255, 255, 255, 0.08)",
                  },
                };
              }}
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
                  {DisciplineIcons[category]({})}
                  <Typography
                    level="h3"
                    sx={{
                      borderRadius: "10px",
                      p: "10px 0",
                      pr: "0",
                    }}
                  >
                    {t("disciplines.categories." + category + ".label")}
                  </Typography>
                  <Box
                    sx={{
                      position: "relative",
                      right: 0,
                      ml: "auto",
                    }}
                  >
                    <MedalIcon
                      category={category}
                      sx={{
                        height: "35px",
                      }}
                      medalType={
                        achievedCategoryMedal
                          ? achievedCategoryMedal[category]
                          : Medals.NONE
                      }
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <DisciplineDatagrid
                  performanceRecordings={performanceRecordings.filter(
                    (p) => p.athlete_id == props.athlete.id &&
                    new Date(p.date_of_performance).getFullYear() === selectedYear,
                  )}
                  disciplines={disciplines.filter(
                    (d) => d.category == category && !isDisciplineInvalid(d),
                  )}
                  isLoading={false}
                  onDisciplineClick={async (d) => {
                    setSelectedDiscipline(d);
                    setDisciplineOpen(true);
                  }}
                  disablePaging={true}
                />
              </AccordionDetails>
            </Accordion>
          ),
        )}
      </Box>
    </>
  );
};

export default AthletePerformanceAccordions;

export { DisciplineIcons };
