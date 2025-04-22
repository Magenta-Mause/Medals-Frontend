import useApi from "@hooks/useApi";
import TrainerInvitationForm from "../EntityInvitationForm";
import SimpleGenericCreationModal from "../EntityCreationModal";

interface TrainerInvitationModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TrainerInvitationModal = ({
  isOpen,
  setOpen,
}: TrainerInvitationModalProps) => {
  const { inviteTrainer } = useApi();

  return (
    <SimpleGenericCreationModal
      isOpen={isOpen}
      setOpen={setOpen}
      header="components.trainerDatagrid.table.toolbar.addTrainer.content"
      FormComponent={TrainerInvitationForm}
      inviteFunction={(data) => inviteTrainer({ ...data, id: -1 })}
      successMessage="snackbar.inviteTrainer.success"
      errorMessage="snackbar.inviteTrainer.failed"
    />
  );
};

export default TrainerInvitationModal;
