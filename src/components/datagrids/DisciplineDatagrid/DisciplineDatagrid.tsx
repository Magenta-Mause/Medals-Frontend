import { Discipline, PerformanceRecording } from "@customTypes/backendTypes";
import useFormatting from "@hooks/useFormatting";
import { Box, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import {
  calculatePerformanceRecordingMedal,
  getBestPerformanceRecording,
} from "@utils/calculationUtil";
import MedalIcon from "@components/MedalIcon/MedalIcon";
import { Medals } from "@customTypes/enums";

interface DisciplineDatagridProps {
  disciplines: Discipline[];
  performanceRecordings: PerformanceRecording[];
  onDisciplineClick?: (d: Discipline) => void;
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
        return <Typography>{item.name}</Typography>;
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
      columnName: t("components.disciplineDatagrid.columns.bestValue"),
      columnMapping(discipline) {
        const bestItem = getBestPerformanceRecording(
          discipline.performanceRecordings,
          discipline,
        );
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <MedalIcon
              category={discipline.category}
              medalType={
                bestItem
                  ? calculatePerformanceRecordingMedal(bestItem)
                  : Medals.NONE
              }
            />
            <Typography>
              {discipline.performanceRecordings.length > 0
                ? formatValue(bestItem.rating_value, discipline.unit)
                : t("messages.noEntriesFound")}
            </Typography>
          </Box>
        );
      },
    },
    {
      columnName: t("components.disciplineDatagrid.columns.recordedAt"),
      columnMapping(item) {
        const bestItem = getBestPerformanceRecording(
          item.performanceRecordings,
          item,
        );
        return (
          <Typography>
            {item.performanceRecordings.length > 0
              ? dateTimeFormatter.format(new Date(bestItem.date_of_performance))
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
        const bestItem = getBestPerformanceRecording(
          discipline.performanceRecordings,
          discipline,
        );

        return (
          <>
            {discipline.description &&
            discipline.performanceRecordings.length > 0
              ? formatValue(bestItem.rating_value, discipline.unit)
              : t("messages.noEntriesFound")}
          </>
        );
      
        return <>{formatValue(bestItem.rating_value, discipline.unit)}</>;
      },
      bottomButtons: [
        {
          label: "Details",
          key: "openDetails",
          operation: props.onDisciplineClick ?? (() => {}),
        },
      ],
      onElementClick: props.onDisciplineClick ?? undefined,
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
                parseInt(Date.parse(p.date_of_performance).toFixed()),
              ),
            ) -
            Math.max(
              0,
              ...b.performanceRecordings.map((p) =>
                parseInt(Date.parse(p.date_of_performance).toFixed()),
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
