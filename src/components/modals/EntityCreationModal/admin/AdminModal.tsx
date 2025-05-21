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
      createFunction={async (data) => {
        try {
          await inviteAdmin({ ...data, id: -1 } as Admin);
          return true;
        } catch (error) {
          console.error("Error inviting admin:", error);
          return false;
        }
      }}
      updateFunction={async (data) => {
        try {
          await updateAdmin(data as Admin);
          return true;
        } catch (error) {
          console.error("Error updating admin:", error);
          return false;
        }
      }}
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
