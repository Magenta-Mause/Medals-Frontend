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

interface EntityWithBasicInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface EntityDatagridProps<T extends EntityWithBasicInfo> {
    entities: T[];
    isLoading: boolean;
    entityType: 'trainer' | 'admin';
    entityPrefix?: string; // e.g., "TRN-" or "ADM-"
    ModalComponent: React.ComponentType<{
      isOpen: boolean;
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }>;
    deleteEntity: (id: number) => Promise<any>;
  }

function EntityDatagrid<T extends EntityWithBasicInfo>({
  entities,
  isLoading,
  entityType,
  entityPrefix = '',
  ModalComponent,
  deleteEntity
}: EntityDatagridProps<T>) {
  const { t } = useTranslation();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const columns: Column<T>[] = [
    {
      columnName: t(`components.${entityType}Datagrid.table.columns.${entityType}Id`),
      columnMapping(item) {
        return <Typography color="primary">{entityPrefix}{item.id}</Typography>;
      },
      size: "s",
      sortable: true,
    },
    {
      columnName: t(`components.${entityType}Datagrid.table.columns.firstName`),
      columnMapping(item) {
        return <Typography>{item.first_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t(`components.${entityType}Datagrid.table.columns.lastName`),
      columnMapping(item) {
        return <Typography>{item.last_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t(`components.${entityType}Datagrid.table.columns.email`),
      size: "l",
      columnMapping(item) {
        return <Typography noWrap>{item.email}</Typography>;
      },
    },
  ];

  const filters: Filter<T>[] = [
    {
      name: "search",
      label: t(`components.${entityType}Datagrid.table.filters.search`),
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
      label: t(`components.${entityType}Datagrid.table.toolbar.add${entityType[0].toUpperCase() + entityType.slice(1)}.label`),
      content: t(`components.${entityType}Datagrid.table.toolbar.add${entityType[0].toUpperCase() + entityType.slice(1)}.content`),
      icon: <Add />,
      collapseToText: true,
      color: "primary",
      key: `invite-${entityType}`,
      variant: "solid",
      operation: async () => {
        setAddModalOpen(true);
      },
    },
  ];

  const actions: Action<T>[] = [
    {
      label: <>{t(`components.${entityType}Datagrid.actions.delete`)}</>,
      color: "danger",
      key: "delete",
      variant: "solid",
      operation: async (item) => {
        await deleteEntity(item.id);
        console.log(`Deleted ${entityType}:`, item);
      },
    },
  ];

  const mobileRendering: MobileTableRendering<T> = {
    avatar: (entity) => <>{entity.id}</>,
    h1: (entity) => (
      <>
        {entity.first_name} {entity.last_name}
      </>
    ),
    h2: (entity) => <>{entity.email}</>,
    bottomButtons: actions,
    searchFilter: {
      name: "search",
      label: "Search",
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

  return (
    <>
      <GenericResponsiveDatagrid
        isLoading={isLoading}
        data={entities}
        columns={columns}
        filters={filters}
        toolbarActions={toolbarActions}
        actionMenu={actions}
        itemSelectionActions={actions}
        keyOf={(item) => item.id}
        mobileRendering={mobileRendering}
      />
      
      <ModalComponent 
        isOpen={addModalOpen}
        setOpen={setAddModalOpen}
      />
    </>
  );
}

export default EntityDatagrid;