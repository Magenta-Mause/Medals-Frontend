import useApi from "@hooks/useApi";
import SimpleGenericCreationModal from "../EntityCreationModal";
import SimpleInvitationForm from "../EntityInvitationForm";

interface AdminInvitationModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminInvitationModal = ({ isOpen, setOpen }: AdminInvitationModalProps) => {
  const { inviteAdmin } = useApi();

  return (
    <SimpleGenericCreationModal
      isOpen={isOpen}
      setOpen={setOpen}
      header="components.adminDatagrid.table.toolbar.addAdmin.content"
      FormComponent={SimpleInvitationForm}
      inviteFunction={(data) => inviteAdmin({ ...data, id: -1 })}
      successMessage="snackbar.inviteAdmin.success"
      errorMessage="snackbar.inviteAdmin.failed"
    />
  );
};

export default AdminInvitationModal;
