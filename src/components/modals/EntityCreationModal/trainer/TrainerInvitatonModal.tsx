import useApi from "@hooks/useApi";
import EntityInvitationForm from "../EntityInvitationForm";
import EntityCreationModal from "../EntityCreationModal";

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
    <EntityCreationModal
      isOpen={isOpen}
      setOpen={setOpen}
      header="components.entityInvitation.modal.header"
      FormComponent={EntityInvitationForm}
      inviteFunction={(data) => inviteTrainer({ ...data, id: -1 })}
      successMessage="snackbar.invite.success"
      errorMessage="snackbar.invite.failed"
      entityType="trainer"
    />
  );
};

export default TrainerInvitationModal;
