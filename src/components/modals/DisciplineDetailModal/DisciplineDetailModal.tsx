import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import PerformanceRecordingDatagrid from "@components/datagrids/PerformanceRecordingDatagrid/PerformanceRecordingDatagrid";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import GenericModal from "../GenericModal";
import { UserType } from "@customTypes/enums";

const DisciplineDetailModal = (props: {
  discipline: Discipline | undefined;
  athlete: Athlete;
  performanceRecordings: PerformanceRecording[];
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedUserType: UserType;
}) => {
  return (
    <GenericModal
      open={props.open}
      setOpen={props.setOpen}
      header={props.discipline?.name ?? "-"}
      modalDialogSX={{
        width: "1000px",
        maxWidth: { md: "calc(90vw - var(--Sidebar-width))", xs: "90vw" },
        overflowY: "auto",
        height: { xs: "calc(90vh - var(--Header-height))", md: "80vh" },
      }}
    >
      {props.athlete ? (
        <>
          {props.selectedUserType === UserType.TRAINER ? (
            <AthleteDetailHeader athlete={props.athlete} />
          ) : (
            <></>
          )}
          <PerformanceRecordingDatagrid
            performanceRecordings={props.performanceRecordings}
            isLoading={false}
            athlete={props.athlete}
            discipline={props.discipline}
            selectedUserType={props.selectedUserType}
          />
        </>
      ) : (
        <></>
      )}
    </GenericModal>
  );
};

export default DisciplineDetailModal;
