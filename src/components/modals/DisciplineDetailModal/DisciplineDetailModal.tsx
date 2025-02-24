import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import PerformanceRecordingDatagrid from "@components/datagrids/PerformanceRecordingDatagrid/PerformanceRecordingDatagrid";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";

const DisciplineDetailModal = (props: {
  discipline: Discipline;
  athlete: Athlete;
  performanceRecordings: PerformanceRecording[];
  open: boolean;
  setOpen: (open: boolean) => void;
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
            <PerformanceRecordingDatagrid
              performanceRecordings={props.performanceRecordings}
              isLoading={false}
            />
          </>
        ) : (
          <></>
        )}
      </ModalDialog>
    </Modal>
  );
};

export default DisciplineDetailModal;
