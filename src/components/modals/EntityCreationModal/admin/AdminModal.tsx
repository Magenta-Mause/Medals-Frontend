import useApi from "@hooks/useApi";
import EntityModal from "../EntityModal";
import EntityForm from "../EntityForm";
import { Admin } from "@customTypes/backendTypes";

interface AdminModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  entityToEdit?: Admin;
}

const AdminModal = ({ isOpen, setOpen, entityToEdit }: AdminModalProps) => {
  const { inviteAdmin, updateAdmin } = useApi();
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
      createFunction={(data) => inviteAdmin({ ...data, id: -1 })}
      updateFunction={(data) => updateAdmin(data)}
      successCreateMessage="snackbar.invite.success"
      errorCreateMessage="snackbar.invite.failed"
      successUpdateMessage="snackbar.update.success"
      errorUpdateMessage="snackbar.update.failed"
      entityType="admin"
      entityToEdit={entityToEdit}
    />
  );
};

export default AdminModal;
