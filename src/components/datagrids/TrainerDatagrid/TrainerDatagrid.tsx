import TrainerInvitationModal from "@components/modals/TrainerInvitationModal/TrainerInvitatonModal";
import { Trainer } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import { Add } from "@mui/icons-material";
import { Typography } from "@mui/joy";
import { removeTrainer } from "@stores/slices/trainerSlice";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  Action,
  ToolbarAction,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";

interface TrainerDatagridProps {
  trainers: Trainer[];
  isLoading: boolean;
}

const TrainerDatagrid = (props: TrainerDatagridProps) => {
  const { deleteTrainer } = useApi();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [addTrainerModalOpen, setAddTrainerModalOpen] = useState(false);

  const columns: Column<Trainer>[] = [
    {
      columnName: t("components.trainerDatagrid.table.columns.trainerId"),
      columnMapping(item) {
        return <Typography color="primary">TRN-{item.id}</Typography>;
      },
      size: "s",
      sortable: true,
    },
    {
      columnName: t("components.trainerDatagrid.table.columns.firstName"),
      columnMapping(item) {
        return <Typography>{item.first_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.trainerDatagrid.table.columns.lastName"),
      columnMapping(item) {
        return <Typography>{item.last_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.trainerDatagrid.table.columns.email"),
      size: "l",
      columnMapping(item) {
        return <Typography noWrap>{item.email}</Typography>;
      },
    },
  ];

  const filters: Filter<Trainer>[] = [
    {
      name: "search",
      label: t("components.trainerDatagrid.table.filters.search"),
      apply(filterParameter) {
        if (filterParameter == undefined) {
          return () => true;
        }
        filterParameter = filterParameter.toLowerCase();
        return (trainer) =>
          trainer.first_name.toLowerCase().includes(filterParameter) ||
          trainer.last_name.toLowerCase().includes(filterParameter) ||
          trainer.email.toLowerCase().includes(filterParameter) ||
          trainer.id.toString().toLowerCase().includes(filterParameter);
      },
      type: "TEXT",
    },
  ];

  const toolbarActions: ToolbarAction[] = [
    {
      label: t("components.trainerDatagrid.table.toolbar.addTrainer.label"),
      content: t("components.trainerDatagrid.table.toolbar.addTrainer.content"),
      icon: <Add />,
      collapseToText: true,
      color: "primary",
      key: "invite-trainer",
      variant: "solid",
      operation: async () => {
        setAddTrainerModalOpen(true);
      },
    },
  ];

  const actions: Action<Trainer>[] = [
    {
      label: <>{t("components.trainerDatagrid.actions.delete")}</>,
      color: "danger",
      key: "delete",
      variant: "solid",
      operation: async (item) => {
        dispatch(removeTrainer({ id: item.id }));
        deleteTrainer(item.id);
        console.log("Deleted Trainer:", item);
      },
    },
  ];

  const mobileRendering: MobileTableRendering<Trainer> = {
    avatar: (trainer) => <>{trainer.id}</>,
    h1: (trainer) => (
      <>
        {trainer.first_name} {trainer.last_name}
      </>
    ),
    h2: (trainer) => <>{trainer.email}</>,
    bottomButtons: actions,
    searchFilter: {
      name: "search",
      label: "Search",
      apply(filterParameter: string | undefined) {
        if (filterParameter == undefined) {
          return () => true;
        }
        filterParameter = filterParameter.toLowerCase();

        return (trainer) =>
          trainer.first_name.toLowerCase().includes(filterParameter) ||
          trainer.last_name.toLowerCase().includes(filterParameter) ||
          trainer.email.toLowerCase().includes(filterParameter) ||
          trainer.id.toString().toLowerCase().includes(filterParameter);
      },
      type: "TEXT",
    },
  };

  return (
    <>
      <GenericResponsiveDatagrid
        isLoading={props.isLoading}
        data={props.trainers}
        columns={columns}
        filters={filters}
        toolbarActions={toolbarActions}
        actionMenu={actions}
        itemSelectionActions={actions}
        keyOf={(item) => item.id}
        mobileRendering={mobileRendering}
      />
      <TrainerInvitationModal
        isOpen={addTrainerModalOpen}
        setOpen={setAddTrainerModalOpen}
      />
    </>
  );
};

export default TrainerDatagrid;
