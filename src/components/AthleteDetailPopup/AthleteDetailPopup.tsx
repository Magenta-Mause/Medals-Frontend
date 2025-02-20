import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import { Athlete } from "@customTypes/bffTypes";
import { FitnessCenter } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";

const AthletePerformanceAccordions = (props: { athlete: Athlete }) => {
  return (
    <Accordion>
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
          <FitnessCenter />
          Strength
        </Typography>
      </AccordionSummary>
      <AccordionDetails></AccordionDetails>
    </Accordion>
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
          py: 5,
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
