import { Discipline, PerformanceRecording } from "@customTypes/backendTypes";
import { Chip, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import { useEffect, useState } from "react";
import useFormatting from "@hooks/useFormatting";

interface DisciplineDatagridProps {
  disciplines: Discipline[];
  performanceRecordings: PerformanceRecording[];
  onDisciplineClick: (d: Discipline) => void;
  isLoading: boolean;
  disablePaging: boolean;
}

interface DisciplineWithPerformanceRecordings extends Discipline {
  performanceRecordings: PerformanceRecording[];
}

const DisciplineDatagrid = (props: DisciplineDatagridProps) => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<DisciplineWithPerformanceRecordings[]>([]);
  const { formatValue } = useFormatting();
  const dateTimeFormatter = new Intl.DateTimeFormat(i18n.language);

  useEffect(() => {
    setData(
      props.disciplines.map((discipline) => {
        return {
          ...discipline,
          performanceRecordings: props.performanceRecordings.filter(
            (recording) =>
              recording.discipline_rating_metric.discipline.id == discipline.id,
          ),
        };
      }),
    );
  }, [props.performanceRecordings, props.disciplines]);

  const columns: Column<DisciplineWithPerformanceRecordings>[] = [
    {
      columnName: t("components.disciplineDatagrid.columns.title"),
      columnMapping(item) {
        return <Typography sx={{color: "lightgray"}}>{item.name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.disciplineDatagrid.columns.description"),
      columnMapping(item) {
        return <Typography>{item.description ?? "-"}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.disciplineDatagrid.columns.lastValue"),
      columnMapping(item) {
        const bestItem = item.performanceRecordings.sort(
          item.more_better
            ? (a, b) => b.rating_value - a.rating_value
            : (a, b) => a.rating_value - b.rating_value,
        )[0];
        return (
          <Typography>
            {item.performanceRecordings.length > 0
              ? formatValue(bestItem.rating_value, item.unit)
              : t("messages.noEntriesFound")}
          </Typography>
        );
      },
    },
    {
      columnName: t("components.disciplineDatagrid.columns.recordedAt"),
      columnMapping(item) {
        const bestItem = item.performanceRecordings.sort(
          item.more_better
            ? (a, b) => b.rating_value - a.rating_value
            : (a, b) => a.rating_value - b.rating_value,
        )[0];
        return (
          <Typography>
            {item.performanceRecordings.length > 0
              ? dateTimeFormatter.format(Date.parse(bestItem.date_recorded))
              : t("messages.noEntriesFound")}
          </Typography>
        );
      },
    },
  ];

  const mobileRendering: MobileTableRendering<DisciplineWithPerformanceRecordings> =
    {
      h1: (discipline) => <>{discipline.name}</>,
      h2: (discipline) => {
        const bestItem = discipline.performanceRecordings.sort(
          discipline.more_better
            ? (a, b) => b.rating_value - a.rating_value
            : (a, b) => a.rating_value - b.rating_value,
        )[0];

        return (
          <>
            {(discipline.description ??
            discipline.performanceRecordings.length > 0)
              ? formatValue(bestItem.rating_value, discipline.unit)
              : t("messages.noEntriesFound")}
          </>
        );
      },
    };

  return (
    <>
      <GenericResponsiveDatagrid
        isLoading={props.isLoading}
        data={data.sort(
          (a, b) =>
            Math.max(
              0,
              ...a.performanceRecordings.map((p) =>
                parseInt(Date.parse(p.date_recorded).toFixed()),
              ),
            ) -
            Math.max(
              0,
              ...b.performanceRecordings.map((p) =>
                parseInt(Date.parse(p.date_recorded).toFixed()),
              ),
            ),
        )}
        columns={columns}
        keyOf={(item) => item.id}
        mobileRendering={mobileRendering}
        onItemClick={props.onDisciplineClick}
        disablePaging={props.disablePaging}
      />
    </>
  );
};

export default DisciplineDatagrid;
