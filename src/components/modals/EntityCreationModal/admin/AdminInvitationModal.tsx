import useApi from "@hooks/useApi";
import EntityCreationModal from "../EntityCreationModal";
import EntityInvitationForm from "../EntityInvitationForm";

interface AdminInvitationModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminInvitationModal = ({
  isOpen,
  setOpen,
}: AdminInvitationModalProps) => {
  const { inviteAdmin } = useApi();

  return (
    <EntityCreationModal
      isOpen={isOpen}
      setOpen={setOpen}
      header="components.entityInvitation.modal.header"
      FormComponent={EntityInvitationForm}
      inviteFunction={(data) => inviteAdmin({ ...data, id: -1 })}
      successMessage="snackbar.invite.success"
      errorMessage="snackbar.invite.failed"
      entityType="admin"
    />
  );
};

export default AdminInvitationModal;
