import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import PerformanceRecordingDatagrid from "@components/datagrids/PerformanceRecordingDatagrid/PerformanceRecordingDatagrid";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import { Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";

const DisciplineDetailModal = (props: {
  discipline: Discipline | undefined;
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
          pt: 6,
          maxWidth: { md: "calc(90vw - var(--Sidebar-width))", xs: "90vw" },
          overflowY: "auto",
          height: { xs: "calc(90vh - var(--Header-height))", md: "80vh" },
          mt: "var(--Header-height)",
        }}
      >
        <ModalClose />
        {props.athlete ? (
          <>
            <Typography level="h1" sx={{ pb: 2 }}>
              {props.discipline?.name ?? "-"}
            </Typography>
            <AthleteDetailHeader athlete={props.athlete} />
            <PerformanceRecordingDatagrid
              performanceRecordings={props.performanceRecordings}
              isLoading={false}
              athlete={props.athlete}
              discipline={props.discipline}
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
