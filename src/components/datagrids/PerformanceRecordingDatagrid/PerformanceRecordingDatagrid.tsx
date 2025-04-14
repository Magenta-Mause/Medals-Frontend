import CreatePerformanceRecordingModal from "@components/modals/CreatePerformanceRecordingModal/CreatePerformanceRecordingModal";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import useFormatting from "@hooks/useFormatting";
import { Chip, Typography } from "@mui/joy";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosCreate } from "react-icons/io";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  Action,
  ToolbarAction,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import MedalIcon from "@components/MedalIcon/MedalIcon";
import { calculatePerformanceRecordingMedal } from "@utils/calculationUtil";
import { UserType } from "@customTypes/enums";

interface PerformanceRecordingDatagridProps {
  performanceRecordings: PerformanceRecording[];
  isLoading: boolean;
  athlete?: Athlete;
  discipline?: Discipline;
  selectedUserTyp: UserType; 
}

const PerformanceRecordingDatagrid = (
  props: PerformanceRecordingDatagridProps,
) => {
  const { deletePerformanceRecording } = useApi();
  const { t } = useTranslation();
  const { formatValue, formatDate } = useFormatting();
  const [isCreationModalOpen, setCreationModalOpen] = useState(false);


  const columns: Column<PerformanceRecording>[] = [
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
            {formatDate(Date.parse(item.date_of_performance)) ?? "-"}
          </Typography>
        );
      },
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
    avatar: () => {
      return (
        <Chip
          sx={{ aspectRatio: 1, height: 45, backgroundColor: "gold" }}
        ></Chip>
      );
    },
    h1: (p) => (
      <>
        {formatValue(
          p.rating_value,
          p.discipline_rating_metric.discipline.unit,
        )}
      </>
    ),
    h2: (p) => <>{formatDate(Date.parse(p.date_of_performance)) ?? "-"}</>,
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
        await deletePerformanceRecording(item.id);
      },
      color: "danger",
    },
  ];

  const actions: ToolbarAction[] = (props.athlete && props.selectedUserTyp === UserType.TRAINER)
    ? [
        {
          label: t("pages.athleteDetailPage.createPerformanceRecordingButton"),
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
        filters={filters}
        keyOf={(item) => item.id}
        mobileRendering={mobileRendering}
        toolbarActions={actions}
        actionMenu={options}
        itemSelectionActions={options}
        disablePaging
      />
      {(props.athlete && props.selectedUserTyp === UserType.TRAINER) ?(
        <CreatePerformanceRecordingModal
          open={isCreationModalOpen}
          setOpen={setCreationModalOpen}
          athlete={props.athlete}
          discipline={props.discipline}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default PerformanceRecordingDatagrid;
