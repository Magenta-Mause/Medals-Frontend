import GenericModal from "@components/modals/GenericModal";
import AthleteAccessDatagrid, {
  AthleteAccessElement,
} from "@components/datagrids/AthleteAccessDatagrid/AthleteAccessDatagrid";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";

const AthleteAccessManagementModal = (props: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const accessRequests = useTypedSelector((state) => state.accessRequests.data);
  const managingTrainers = useTypedSelector(
    (state) => state.managingTrainer.data,
  );
  const { t } = useTranslation();
  const requests: AthleteAccessElement[] = [
    ...accessRequests.map((request) => ({
      state: "PENDING",
      athlete: request.athlete,
      trainer: request.trainer,
      accessRequest: request,
    })),
    ...managingTrainers.map((trainer) => ({
      state: "APPROVED",
      trainer: trainer,
    })),
  ] as AthleteAccessElement[];

  return (
    <GenericModal
      header={t("components.athleteAccessManagementModal.header")}
      open={props.isOpen}
      setOpen={props.setOpen}
      modalDialogSX={{ zIndex: 1001 }}
    >
      <AthleteAccessDatagrid data={requests} />
    </GenericModal>
  );
};

export default AthleteAccessManagementModal;
