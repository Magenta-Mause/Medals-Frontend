import useApi from "@hooks/useApi";
import EntityForm from "../EntityForm";
import EntityModal from "../EntityModal";

interface TrainerData {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface TrainerModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  entityToEdit?: TrainerData;
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
      createFunction={(data) => inviteTrainer({ ...data, id: -1 })}
      updateFunction={(data) => updateTrainer(data)}
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
