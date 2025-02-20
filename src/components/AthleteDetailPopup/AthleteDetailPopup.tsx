import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import DisciplineDatagrid from "@components/Datagrids/DisciplineDatagrid/DisciplineDatagrid";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import { DisciplineCategories } from "@customTypes/enums";
import { FitnessCenter } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";

const AthletePerformanceAccordions = (props: { athlete: Athlete }) => {
  const performances = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const disciplines = useTypedSelector(
    (state) => state.disciplines.data,
  ) as Discipline[];
  const { t } = useTranslation();

  return (
    <>
      {Object.values(DisciplineCategories).map(
        (category: DisciplineCategories) => (
          <Accordion key={category}>
            <AccordionSummary>
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
                disciplines={disciplines}
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

const AthleteDetailPopup = (props: {
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
          sm: "0",
        },
      }}
    >
      <ModalDialog
        sx={{
          width: "1000px",
          py: 6,
          maxWidth: { md: "calc(90vw - var(--Sidebar-width))", xs: "90vw" },
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

export default AthleteDetailPopup;
