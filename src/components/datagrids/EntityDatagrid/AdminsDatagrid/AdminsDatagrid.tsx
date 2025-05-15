import EntityDatagrid from "../EntityDatagrid";
import { Admin } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import AdminModal from "@components/modals/EntityCreationModal/admin/AdminModal";

interface AdminsDatagridProps {
  admins: Admin[];
}

const AdminsDatagrid = (props: AdminsDatagridProps) => {
  const { deleteAdmin } = useApi();

  return (
    <EntityDatagrid
      entities={props.admins}
      entityType="admin"
      ModalComponent={AdminModal}
      deleteEntity={deleteAdmin}
    />
  );
};

export default AdminsDatagrid;
