import EntityDatagrid from "../EntityDatagrid";
import { Trainer } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import TrainerInvitationModal from "@components/modals/EntityCreationModal/trainer/TrainerInvitatonModal";

interface TrainerDatagridProps {
  trainers: Trainer[];
  isLoading: boolean;
}

const TrainerDatagrid = (props: TrainerDatagridProps) => {
  const { deleteTrainer } = useApi();

  return (
    <EntityDatagrid
      entities={props.trainers}
      isLoading={props.isLoading}
      entityType="trainer"
      entityPrefix="TRN-"
      ModalComponent={TrainerInvitationModal}
      deleteEntity={deleteTrainer}
    />
  );
};

export default TrainerDatagrid;
