import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import useFormatting from "@hooks/useFormatting";
import { Chip, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  ToolbarAction,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import CreatePerformanceRecordingModal from "@components/modals/CreatePerformanceRecordingModal/CreatePerformanceRecordingModal";
import { useState } from "react";

interface PerformanceRecordingDatagridProps {
  performanceRecordings: PerformanceRecording[];
  isLoading: boolean;
  athlete?: Athlete;
  discipline?: Discipline;
}

const PerformanceRecordingDatagrid = (
  props: PerformanceRecordingDatagridProps,
) => {
  const { t } = useTranslation();
  const { formatValue, formatDate } = useFormatting();
  const [isCreationModalOpen, setCreationModalOpen] = useState(false);
  const createPerformanceRecording = (p: PerformanceRecording) => {
    console.log(p);
  };

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
      columnName: "Medal",
      columnMapping() {
        return "Not implemented yet";
      },
    },
  ];

  const mobileRendering: MobileTableRendering<PerformanceRecording> = {
    avatar: (p) => {
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

  const actions: ToolbarAction[] = [
    ...(props.athlete
      ? [
          {
            label: "Leistungsaufnahme hinzufügen",
            key: "addRecording",
            operation: () => {
              setCreationModalOpen(true);
            },
            content: "+ Add",
          },
        ]
      : []),
  ];
  
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
      />
      {props.athlete ? (
        <CreatePerformanceRecordingModal
          open={isCreationModalOpen}
          setOpen={setCreationModalOpen}
          athlete={props.athlete}
          onCreatePerformanceRecording={createPerformanceRecording}
          defaultSelected={props.discipline}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default PerformanceRecordingDatagrid;
