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
      columnName: "Titel",
      columnMapping(item) {
        return <Typography>{item.name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: "Beschreibung",
      columnMapping(item) {
        return <Typography>{item.description ?? "-"}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: "Letzter Wert",
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
              : "-"}
          </Typography>
        );
      },
    },
    {
      columnName: "Aufgenommen am",
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
              : "-"}
          </Typography>
        );
      },
    },
  ];

  const mobileRendering: MobileTableRendering<DisciplineWithPerformanceRecordings> =
    {
      avatar: (discipline) => <>{discipline.id}</>,
      h1: (discipline) => <>{discipline.name}</>,
      h2: (discipline) => <>{discipline.description}</>,
      topRightInfo: (athlete) => (
        <Chip
          size="md"
          sx={{
            aspectRatio: 1,
            p: 1,
            height: "2rem",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            textAlign: "center",
          }}
        >
          {athlete.unit.slice(0, 1).toUpperCase()}
        </Chip>
      ),
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
