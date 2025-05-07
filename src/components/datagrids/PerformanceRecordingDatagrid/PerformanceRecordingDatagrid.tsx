import CreatePerformanceRecordingModal from "@components/modals/CreatePerformanceRecordingModal/CreatePerformanceRecordingModal";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import useFormatting from "@hooks/useFormatting";
import { Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosCreate } from "react-icons/io";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  Action,
  ToolbarAction,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import MedalIcon from "@components/icons/MedalIcon/MedalIcon";
import { calculatePerformanceRecordingMedal } from "@utils/calculationUtil";
import { UserType } from "@customTypes/enums";
import ConfirmationPopup from "@components/ConfirmationPopup/ConfirmationPopup";
import { enqueueSnackbar } from "notistack";

interface PerformanceRecordingDatagridProps {
  performanceRecordings: PerformanceRecording[];
  isLoading: boolean;
  athlete?: Athlete;
  discipline?: Discipline;
  selectedUserType: UserType;
  hideFilter?: boolean;
  showDisciplines?: boolean;
}

const PerformanceRecordingDatagrid = (
  props: PerformanceRecordingDatagridProps,
) => {
  const { deletePerformanceRecording } = useApi();
  const { t } = useTranslation();
  const { formatValue, formatLocalizedDate } = useFormatting();
  const [isCreationModalOpen, setCreationModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PerformanceRecording[]>(
    [],
  );

  const columns: Column<PerformanceRecording>[] = [
    ...(props.showDisciplines
      ? [
          {
            columnName: t(
              "components.performanceRecordingDatagrid.columns.discipline",
            ),
            columnMapping(item: PerformanceRecording) {
              return item.discipline_rating_metric.discipline.name;
            },
            size: "l" as "l" | "m",
          },
        ]
      : []),
    {
      columnName: t("components.performanceRecordingDatagrid.columns.result"),
      columnMapping(p) {
        return (
          <Typography>
            {formatValue(
              p.rating_value,
              p.discipline_rating_metric.discipline.unit,
            )}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      columnName: t(
        "components.performanceRecordingDatagrid.columns.dateOfRecording",
      ),
      columnMapping(item) {
        return (
          <Typography>
            {formatLocalizedDate(item.date_of_performance) ?? "-"}
          </Typography>
        );
      },
      size: "l",
      sortable: true,
    },
    {
      columnName: t("components.performanceRecordingDatagrid.columns.medal"),
      columnMapping(item) {
        return (
          <MedalIcon
            category={item.discipline_rating_metric.discipline.category}
            medalType={calculatePerformanceRecordingMedal(item)}
          />
        );
      },
    },
  ];

  const mobileRendering: MobileTableRendering<PerformanceRecording> = {
    avatar: (item) => {
      return (
        <MedalIcon
          category={item.discipline_rating_metric.discipline.category}
          medalType={calculatePerformanceRecordingMedal(item)}
        />
      );
    },
    h1: (p) => (
      <>
        {props.showDisciplines
          ? p.discipline_rating_metric.discipline.name
          : formatValue(
              p.rating_value,
              p.discipline_rating_metric.discipline.unit,
            )}
      </>
    ),
    h2: (p) => (
      <>
        {(props.showDisciplines
          ? formatValue(
              p.rating_value,
              p.discipline_rating_metric.discipline.unit,
            ) + " - "
          : " ") + (formatLocalizedDate(p.date_of_performance) ?? "-")}
      </>
    ),
  };

  const filters: Filter<PerformanceRecording>[] = [
    {
      name: "Recorded in",
      label: t("components.performanceRecordingDatagrid.filters.recordedIn"),
      type: "SELECTION",
      selection: [
        ...new Set(
          props.performanceRecordings.map((p) =>
            new Date(Date.parse(p.date_of_performance))
              .getFullYear()
              .toString(),
          ),
        ),
      ].map((date) => ({
        displayValue: date,
        value: date,
      })),
      apply: (filterParameter) => (item) =>
        item.date_of_performance == filterParameter,
    },
  ];

  const options: Action<PerformanceRecording>[] = [
    {
      label: t("components.performanceRecordingDatagrid.actions.delete"),
      key: "delete",
      operation: async (item) => {
        setSelectedRecord((prev) => [...prev, item]);
        setDeleteModalOpen(true);
      },
      color: "danger",
    },
  ];

  const actions: ToolbarAction[] =
    props.athlete && props.selectedUserType === UserType.TRAINER
      ? [
          {
            label: t(
              "pages.athleteDetailPage.createPerformanceRecordingButton",
            ),
            key: "addRecording",
            operation: async () => {
              await setCreationModalOpen(true);
            },
            icon: <IoIosCreate />,
            content: t(
              "components.performanceRecordingDatagrid.actions.add.text",
            ),
            color: "primary",
            variant: "solid",
          },
        ]
      : [];

  const handleConfirmDeletion = async () => {
    if (selectedRecord.length === 0) return;
    try {
      for (const item of selectedRecord) {
        await deletePerformanceRecording(item.id);
      }
      enqueueSnackbar(t("snackbar.performanceRecording.deletionSuccess"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error while deleting perfomance recordings", error);
      enqueueSnackbar(t("snackbar.performanceRecording.deletionError"), {
        variant: "error",
      });
    }
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    if (!isDeleteModalOpen) {
      setSelectedRecord([]);
    }
  }, [isDeleteModalOpen]);

  return (
    <>
      <GenericResponsiveDatagrid
        isLoading={props.isLoading}
        data={props.performanceRecordings.sort(
          (a, b) =>
            Date.parse(a.date_of_performance) -
            Date.parse(b.date_of_performance),
        )}
        columns={columns}
        filters={props.hideFilter ? undefined : filters}
        keyOf={(item) => item.id}
        mobileRendering={mobileRendering}
        toolbarActions={
          props.selectedUserType === UserType.TRAINER ? actions : undefined
        }
        actionMenu={
          props.selectedUserType === UserType.TRAINER ? options : undefined
        }
        itemSelectionActions={
          props.selectedUserType === UserType.TRAINER ? options : undefined
        }
        disablePaging
      />
      {props.athlete && props.selectedUserType === UserType.TRAINER ? (
        <CreatePerformanceRecordingModal
          open={isCreationModalOpen}
          setOpen={setCreationModalOpen}
          athlete={props.athlete}
          discipline={props.discipline}
        />
      ) : (
        <></>
      )}
      <ConfirmationPopup
        open={isDeleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={handleConfirmDeletion}
        header={t(
          "components.performanceRecordingDatagrid.deletionModal.header",
        )}
        message={t(
          "components.performanceRecordingDatagrid.deletionModal.confirmDeleteMessage",
        )}
      />
    </>
  );
};

export default PerformanceRecordingDatagrid;
