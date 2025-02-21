import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import DisciplineDatagrid from "@components/Datagrids/DisciplineDatagrid/DisciplineDatagrid";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import { DisciplineCategories } from "@customTypes/enums";
import { Check } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const AthletePerformanceAccordions = (props: { athlete: Athlete }) => {
  const performances = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const disciplines = useTypedSelector(
    (state) => state.disciplines.data,
  ) as Discipline[];
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [hoveredYear, setHoveredYear] = useState<number>(
    new Date().getFullYear(),
  );

  return (
    <>
      <form
        onSubmit={(e) => {
          setSelectedYear(hoveredYear);
          e.preventDefault();
        }}
      >
        <FormControl>
          <FormLabel>
            {t("components.athletePerformanceAccordions.selectedYear")}
          </FormLabel>
          <Input
            placeholder={String(new Date().getFullYear())}
            type={"number"}
            onChange={(e) => setHoveredYear(parseInt(e.target.value))}
            endDecorator={
              <IconButton
                onClick={() => {
                  setSelectedYear(hoveredYear);
                }}
                variant="soft"
                color={selectedYear != hoveredYear ? "success" : "neutral"}
              >
                <Check
                  color={selectedYear != hoveredYear ? "success" : "disabled"}
                />
              </IconButton>
            }
          />
        </FormControl>
      </form>
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
                  background: "rgba(255, 255, 255, 0.05)",
                },
              };
            }}
          >
            <AccordionSummary
              sx={{ marginY: 1, borderRadius: 25 }}
              slotProps={{ button: { sx: { borderRadius: 10 } } }}
            >
              <Typography
                level="h3"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                {t("disciplines.categories." + category + ".icon") +
                  " " +
                  t("disciplines.categories." + category + ".label")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DisciplineDatagrid
                performanceRecordings={performances.filter(
                  (p) => p.athlete_id == props.athlete.id,
                )}
                disciplines={disciplines.filter(
                  (d) => d.category == category && d.valid_in == selectedYear,
                )}
                isLoading={false}
                onDisciplineClick={console.log}
                disablePaging={true}
              />
            </AccordionDetails>
          </Accordion>
        ),
      )}
    </>
  );
};

const AthleteDetailModal = (props: {
  athlete: Athlete | null;
  open: boolean;
  setOpen: (newVal: boolean) => void;
}) => {
  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      sx={{
        left: {
          md: "var(--Sidebar-width)",
          xs: "0",
        },
        marginTop: {
          md: 0,
          xs: 5,
        },
      }}
    >
      <ModalDialog
        sx={{
          width: "1000px",
          pt: 6,
          maxWidth: { md: "calc(90vw - var(--Sidebar-width))", xs: "90vw" },
          overflowY: "auto",
          height: { xs: "90vh", md: "80vh" },
        }}
      >
        <ModalClose />
        {props.athlete ? (
          <>
            <AthleteDetailHeader athlete={props.athlete} />
            <AthletePerformanceAccordions athlete={props.athlete} />
          </>
        ) : (
          <></>
        )}
      </ModalDialog>
    </Modal>
  );
};

export default AthleteDetailModal;
