import useApi from "@hooks/useApi";
import EntityForm from "../EntityForm";
import EntityModal from "../EntityModal";
import { Trainer } from "@customTypes/backendTypes";

interface TrainerModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  entityToEdit?: Trainer;
}

const TrainerModal = ({ isOpen, setOpen, entityToEdit }: TrainerModalProps) => {
  const { inviteTrainer, updateTrainer } = useApi();
  const isEditMode = !!entityToEdit;

  return (
    <EntityModal
      isOpen={isOpen}
      setOpen={setOpen}
      header={
        isEditMode
          ? "components.entityModal.modal.editHeader"
          : "components.entityModal.modal.createHeader"
      }
      FormComponent={EntityForm}
      createFunction={async (data) => {
        try {
          await inviteTrainer({ ...data, id: -1 } as Trainer);
          return true;
        } catch (error) {
          console.error("Error inviting trainer:", error);
          return false;
        }
      }}
      updateFunction={async (data) => {
        try {
          await updateTrainer(data as Trainer);
          return true;
        } catch (error) {
          console.error("Error updating trainer:", error);
          return false;
        }
      }}
      successCreateMessage="snackbar.invite.success"
      errorCreateMessage="snackbar.invite.failed"
      successUpdateMessage="snackbar.update.success"
      errorUpdateMessage="snackbar.update.failed"
      entityType="trainer"
      entityToEdit={entityToEdit}
    />
  );
};

export default TrainerModal;
