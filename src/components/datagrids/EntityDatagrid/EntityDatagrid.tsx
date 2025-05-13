import { Typography } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import GenericResponsiveDatagrid, {
  Action,
  ToolbarAction,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import ConfirmationPopup from "@components/ConfirmationPopup/ConfirmationPopup";
import { enqueueSnackbar } from "notistack";

interface EntityWithBasicInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface EntityDatagridProps<T extends EntityWithBasicInfo> {
  entities: T[];
  entityType: "trainer" | "admin";
  ModalComponent: React.ComponentType<{
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    entityToEdit?: T;
  }>;
  deleteEntity: (id: number) => Promise<any>;
}

function EntityDatagrid<T extends EntityWithBasicInfo>({
  entities,
  entityType,
  ModalComponent,
  deleteEntity,
}: EntityDatagridProps<T>) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [entityToEdit, setEntityToEdit] = useState<T | undefined>(undefined);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<T | undefined>(
    undefined,
  );

  const columns: Column<T>[] = [
    {
      columnName: t("components.entityDatagrid.table.columns.firstName"),
      columnMapping(item) {
        return <Typography>{item.first_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.entityDatagrid.table.columns.lastName"),
      columnMapping(item) {
        return <Typography>{item.last_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.entityDatagrid.table.columns.email"),
      size: "l",
      columnMapping(item) {
        return <Typography noWrap>{item.email}</Typography>;
      },
    },
  ];

  const filters: Filter<T>[] = [
    {
      name: "search",
      label: t("components.entityDatagrid.table.filters.search"),
      apply(filterParameter) {
        if (filterParameter == undefined) {
          return () => true;
        }
        filterParameter = filterParameter.toLowerCase();
        return (entity) =>
          entity.first_name.toLowerCase().includes(filterParameter) ||
          entity.last_name.toLowerCase().includes(filterParameter) ||
          entity.email.toLowerCase().includes(filterParameter) ||
          entity.id.toString().toLowerCase().includes(filterParameter);
      },
      type: "TEXT",
    },
  ];

  const toolbarActions: ToolbarAction[] = [
    {
      label: t("components.entityDatagrid.table.toolbar.add.label"),
      content: t("components.entityDatagrid.table.toolbar.add.content", {
        entityType: t(`generic.${entityType}.singular`),
      }),
      icon: <Add />,
      collapseToText: true,
      color: "primary",
      key: `invite-${entityType}`,
      variant: "solid",
      operation: async () => {
        setEntityToEdit(undefined);
        setModalOpen(true);
      },
    },
  ];

  const handleDeleteConfirmation = async () => {
    if (!entityToDelete) return;

    try {
      await deleteEntity(entityToDelete.id);
      console.log(`Deleted ${entityType}:`, entityToDelete);
      enqueueSnackbar(
        t("snackbar.entityDatagrid.deletionSuccess", {
          entityType: t(`generic.${entityType}.singular`),
        }),
        { variant: "success" },
      );
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
      enqueueSnackbar(
        t("snackbar.entityDatagrid.deletionError", {
          entityType: t(`generic.${entityType}.singular`),
        }),
        { variant: "error" },
      );
    } finally {
      setEntityToDelete(undefined);
      setDeleteModalOpen(false);
    }
  };

  const deleteAction: Action<T> = {
    label: <>{t("components.entityDatagrid.actions.delete")}</>,
    color: "danger",
    key: "delete",
    variant: "solid",
    operation: async (item) => {
      setEntityToDelete(item);
      setDeleteModalOpen(true);
    },
  };

  const editAction: Action<T> = {
    label: <>{t("components.entityDatagrid.actions.edit")}</>,
    color: "primary",
    key: "edit",
    variant: "solid",
    operation: async (item) => {
      setEntityToEdit(item);
      setModalOpen(true);
      console.log(`Edit ${entityType}:`, item);
    },
  };

  const actionMenuActions: Action<T>[] = [deleteAction, editAction];

  const itemSelectionActions: Action<T>[] = [deleteAction];

  const mobileRendering: MobileTableRendering<T> = {
    avatar: (entity) => <>{entity.id}</>,
    h1: (entity) => (
      <>
        {entity.first_name} {entity.last_name}
      </>
    ),
    h2: (entity) => <>{entity.email}</>,
    bottomButtons: actionMenuActions,
    searchFilter: {
      name: "search",
      label: t("components.entityDatagrid.table.filters.search"),
      apply(filterParameter: string | undefined) {
        if (filterParameter == undefined) {
          return () => true;
        }
        filterParameter = filterParameter.toLowerCase();

        return (entity) =>
          entity.first_name.toLowerCase().includes(filterParameter) ||
          entity.last_name.toLowerCase().includes(filterParameter) ||
          entity.email.toLowerCase().includes(filterParameter) ||
          entity.id.toString().toLowerCase().includes(filterParameter);
      },
      type: "TEXT",
    },
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEntityToEdit(undefined);
  };

  const getEntityName = () => {
    if (!entityToDelete) return "";
    return `${entityToDelete.first_name} ${entityToDelete.last_name}`;
  };

  return (
    <>
      <GenericResponsiveDatagrid
        data={entities}
        columns={columns}
        filters={filters}
        toolbarActions={toolbarActions}
        actionMenu={actionMenuActions}
        itemSelectionActions={itemSelectionActions}
        keyOf={(item) => item.id}
        mobileRendering={mobileRendering}
      />

      <ModalComponent
        isOpen={modalOpen}
        setOpen={handleModalClose}
        entityToEdit={entityToEdit}
      />

      <ConfirmationPopup
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmation}
        header={t("components.entityDatagrid.deletionModal.header", {
          entityType: t(`generic.${entityType}.singular`),
        })}
        message={t(
          "components.entityDatagrid.deletionModal.confirmDeleteMessage",
          {
            entityType: t(`generic.${entityType}.singular`),
            entityName: getEntityName(),
          },
        )}
        confirmButtonText={t("components.confirmationPopup.deleteButton")}
      />
    </>
  );
}

export default EntityDatagrid;
