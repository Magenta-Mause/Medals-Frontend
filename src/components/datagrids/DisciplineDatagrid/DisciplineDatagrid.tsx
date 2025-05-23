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
import MedalIcon from "@components/icons/MedalIcon/MedalIcon";
import { Medals } from "@customTypes/enums";
import { DisciplineInfo } from "@components/datagrids/PerformanceMetricDatagrid/PerformanceMetricDatagrid";

interface DisciplineDatagridProps {
  disciplines: Discipline[];
  performanceRecordings: PerformanceRecording[];
  onDisciplineClick?: (d: Discipline) => Promise<void>;
  isLoading: boolean;
  disablePaging: boolean;
}

interface DisciplineWithPerformanceRecordings extends Discipline {
  performanceRecordings: PerformanceRecording[];
}

const DisciplineDatagrid = (props: DisciplineDatagridProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<DisciplineWithPerformanceRecordings[]>([]);
  const { formatValue, formatLocalizedDate } = useFormatting();

  useEffect(() => {
    setData(
      props.disciplines.map((discipline) => ({
        ...discipline,
        performanceRecordings: props.performanceRecordings.filter(
          (recording) =>
            recording.discipline_rating_metric.discipline.id == discipline.id,
        ),
      })),
    );
  }, [props.performanceRecordings, props.disciplines]);

  const columns: Column<DisciplineWithPerformanceRecordings>[] = [
    {
      columnName: t("generic.discipline"),
      columnMapping: (discipline: Discipline) => (
        <DisciplineInfo
          name={discipline.name}
          description={discipline.description}
        />
      ),
      size: "m",
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
            {bestItem && (
              <MedalIcon
                category={discipline.category}
                medalType={calculatePerformanceRecordingMedal(bestItem)}
              />
            )}
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
              ? formatLocalizedDate(bestItem.date_of_performance)
              : t("messages.noEntriesFound")}
          </Typography>
        );
      },
    },
  ];

  const mobileRendering: MobileTableRendering<DisciplineWithPerformanceRecordings> =
    {
      h1: (discipline) => <>{discipline.name}</>,
      h2: (discipline) => <>{discipline.description}</>,
      h3: (discipline) => {
        const bestItem = getBestPerformanceRecording(
          discipline.performanceRecordings,
          discipline,
        );
        return (
          <>
            {discipline.performanceRecordings.length > 0
              ? t("components.disciplineDatagrid.columns.bestValue") +
                ": " +
                formatValue(bestItem.rating_value, discipline.unit)
              : t("messages.noEntriesFound")}
          </>
        );
      },
      topRightInfo: (discipline) => {
        const bestItem = getBestPerformanceRecording(
          discipline.performanceRecordings,
          discipline,
        );
        return (
          <MedalIcon
            category={discipline.category}
            medalType={
              bestItem
                ? calculatePerformanceRecordingMedal(bestItem)
                : Medals.NONE
            }
          />
        );
      },
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
              ...b.performanceRecordings.map((p) =>
                parseInt(Date.parse(p.date_of_performance).toFixed()),
              ),
            ) -
            Math.max(
              0,
              ...a.performanceRecordings.map((p) =>
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
