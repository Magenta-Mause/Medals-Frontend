import { PerformanceRecording } from "@customTypes/backendTypes";
import useFormatting from "@hooks/useFormatting";
import { Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";

interface PerformanceRecordingDatagridProps {
  performanceRecordings: PerformanceRecording[];
  isLoading: boolean;
}

const PerformanceRecordingDatagrid = (
  props: PerformanceRecordingDatagridProps,
) => {
  const { t, i18n } = useTranslation();
  const { formatValue } = useFormatting();
  const dateTimeFormatter = new Intl.DateTimeFormat(i18n.language);

  const columns: Column<PerformanceRecording>[] = [
    {
      columnName: t("components.performanceRecordingDatagrid.columns.title"),
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
        "components.performanceRecordingDatagrid.columns.description",
      ),
      columnMapping(item) {
        return (
          <Typography>
            {dateTimeFormatter.format(Date.parse(item.date_recorded)) ?? "-"}
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

  return (
    <>
      <GenericResponsiveDatagrid
        isLoading={props.isLoading}
        data={props.performanceRecordings.sort(
          (a, b) => Date.parse(a.date_recorded) - Date.parse(b.date_recorded),
        )}
        columns={columns}
        keyOf={(item) => item.id}
        mobileRendering={mobileRendering}
      />
    </>
  );
};

export default PerformanceRecordingDatagrid;
