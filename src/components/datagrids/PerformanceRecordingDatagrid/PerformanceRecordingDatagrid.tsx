import { PerformanceRecording } from "@customTypes/backendTypes";
import useFormatting from "@hooks/useFormatting";
import { Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  ToolbarAction,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";

interface PerformanceRecordingDatagridProps {
  performanceRecordings: PerformanceRecording[];
  isLoading: boolean;
}

const PerformanceRecordingDatagrid = (
  props: PerformanceRecordingDatagridProps,
) => {
  const { t } = useTranslation();
  const { formatValue, formatDate } = useFormatting();

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
            {formatDate(Date.parse(item.date_recorded)) ?? "-"}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      columnName: "Medaillie",
      columnMapping() {
        return "Not implemented yet";
      },
    },
  ];

  const mobileRendering: MobileTableRendering<PerformanceRecording> = {
    h1: (p) => (
      <>
        {formatValue(
          p.rating_value,
          p.discipline_rating_metric.discipline.unit,
        )}
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
            new Date(Date.parse(p.date_recorded)).getFullYear().toString(),
          ),
        ),
      ].map((date) => ({
        displayValue: date,
        value: date,
      })),
      apply: (filterParameter) => (item) =>
        item.date_recorded == filterParameter,
    },
  ];

  const actions: ToolbarAction[] = [
    {
      label: "Leistungsaufnahme hinzufügen",
      key: "addRecording",
      operation: () => {
        console.log("add new performance");
      },
      content: "+ Add",
    },
  ];

  return (
    <>
      <GenericResponsiveDatagrid
        isLoading={props.isLoading}
        data={props.performanceRecordings.sort(
          (a, b) => Date.parse(a.date_recorded) - Date.parse(b.date_recorded),
        )}
        columns={columns}
        filters={filters}
        keyOf={(item) => item.id}
        mobileRendering={mobileRendering}
        toolbarActions={actions}
      />
    </>
  );
};

export default PerformanceRecordingDatagrid;
