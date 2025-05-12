import GenericModal from "@components/modals/GenericModal";
import AthleteAccessDatagrid, {
  AthleteAccessElement,
} from "@components/datagrids/AthleteAccessDatagrid/AthleteAccessDatagrid";
import { useTypedSelector } from "@stores/rootReducer";

const AthleteAccessManagementModal = (props: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const accessRequests = useTypedSelector((state) => state.accessRequests.data);
  const managingTrainers = useTypedSelector(
    (state) => state.managingTrainer.data,
  );
  const requests: AthleteAccessElement[] = [
    ...accessRequests.map((request) => ({
      status: "PENDING",
      athlete: request.athlete,
      trainer: request.trainer,
      accessRequest: request,
    })),
    ...managingTrainers.map((trainer) => ({
      status: "APPROVED",
      trainer: trainer,
    })),
  ] as AthleteAccessElement[];

  return (
    <GenericModal
      header={"Zugriff verwalten"}
      open={props.isOpen}
      setOpen={props.setOpen}
    >
      <AthleteAccessDatagrid data={requests} />
    </GenericModal>
  );
};

export default AthleteAccessManagementModal;
