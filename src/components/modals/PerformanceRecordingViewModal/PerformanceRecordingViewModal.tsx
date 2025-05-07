import GenericModal from "@components/modals/GenericModal";
import { useTranslation } from "react-i18next";
import { PerformanceRecording } from "@customTypes/backendTypes";
import PerformanceRecordingDatagrid from "@components/datagrids/PerformanceRecordingDatagrid/PerformanceRecordingDatagrid";
import { UserType } from "@customTypes/enums";
import useFormatting from "@hooks/useFormatting";

const PerformanceRecordingViewModal = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  performanceRecordings: PerformanceRecording[];
  selectedDate?: string;
}) => {
  const { t } = useTranslation();
  const { formatLocalizedDate } = useFormatting();

  return (
    <GenericModal
      header={
        props.selectedDate
          ? t("components.performanceRecordingViewModal.header.date") +
            formatLocalizedDate(Date.parse(props.selectedDate))
          : t("components.performanceRecordingViewModal.header.plain")
      }
      open={props.open}
      setOpen={props.setOpen}
      modalDialogSX={{
        minWidth: { md: "850px", sx: "90vw" },
        maxHeight: "80vh",
      }}
    >
      <PerformanceRecordingDatagrid
        isLoading={false}
        performanceRecordings={props.performanceRecordings}
        selectedUserType={UserType.ATHLETE}
        hideFilter={true}
        showDisciplines={true}
      />
    </GenericModal>
  );
};

export default PerformanceRecordingViewModal;
