import DisciplineDatagrid from "@components/datagrids/DisciplineDatagrid/DisciplineDatagrid";
import DisciplineDetailModal from "@components/modals/DisciplineDetailModal/DisciplineDetailModal";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import { DisciplineCategories } from "@customTypes/enums";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { GiJumpingRope } from "react-icons/gi";
import { FaRunning, FaStopwatch } from "react-icons/fa";
import { BiDumbbell } from "react-icons/bi";

const DisciplineIcons: Record<DisciplineCategories, ReactNode> = {
  COORDINATION: <GiJumpingRope />,
  ENDURANCE: <FaRunning />,
  SPEED: <FaStopwatch />,
  STRENGTH: <BiDumbbell />,
};

const AthletePerformanceAccordions = (props: { athlete: Athlete }) => {
  const performances = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const disciplines = useTypedSelector(
    (state) => state.disciplines.data,
  ) as Discipline[];
  const { t } = useTranslation();
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>();
  const [isDisciplineOpen, setDisciplineOpen] = useState(false);

  return (
    <>
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
          performanceRecordings={performances.filter(
            (p) =>
              p.athlete_id == props.athlete.id &&
              (selectedDiscipline
                ? selectedDiscipline.id ==
                  p.discipline_rating_metric.discipline.id
                : false),
          )}
          discipline={selectedDiscipline}
          open={isDisciplineOpen}
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
                }}
                slotProps={{ button: { sx: { borderRadius: 10 } } }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyItems: "flex-start",
                    gap: 5,
                    pl: 2,
                    "> svg": {
                      height: "30px",
                      width: "30px",
                    },
                  }}
                >
                  {DisciplineIcons[category]}
                  <Typography
                    level="h3"
                    sx={{
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  >
                    {t("disciplines.categories." + category + ".label")}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <DisciplineDatagrid
                  performanceRecordings={performances.filter(
                    (p) => p.athlete_id == props.athlete.id,
                  )}
                  disciplines={disciplines.filter(
                    (d) => d.category == category,
                  )}
                  isLoading={false}
                  onDisciplineClick={(d) => {
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
