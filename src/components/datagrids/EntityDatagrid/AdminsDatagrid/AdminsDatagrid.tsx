import EntityDatagrid from "../EntityDatagrid";
import { Admin } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import AdminInvitationModal from "@components/modals/EntityCreationModal/admin/AdminInvitationModal";

interface AdminsDatagridProps {
  admins: Admin[];
  isLoading: boolean;
}

const AdminsDatagrid = (props: AdminsDatagridProps) => {
  const { deleteAdmin } = useApi();

  return (
    <EntityDatagrid
      entities={props.admins}
      isLoading={props.isLoading}
      entityType="admin"
      entityPrefix="ADM-"
      ModalComponent={AdminInvitationModal}
      deleteEntity={deleteAdmin}
    />
  );
};

export default AdminsDatagrid;
