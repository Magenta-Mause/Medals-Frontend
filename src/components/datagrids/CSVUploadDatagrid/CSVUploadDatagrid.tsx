import { AthleteWithValidity } from "@components/modals/AthleteImportModal/AthleteImportModal";
import GenericResponsiveDatagrid from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/joy";
import { Cloud } from "@mui/icons-material";
import UploadIcon from "@mui/icons-material/Upload";
import { CSVUploadState } from "@customTypes/enums";
import HoverTooltip from "@components/HoverTooltip/HoverTooltip";
import { CSSProperties } from "styled-components";
import { CSVData } from "@components/CSVUploadComponent/CSVUploadComponent";

const IconProps: CSSProperties = {
  zIndex: 1,
};

interface CSVUploadDatagridProps<T> {
  csvData: CSVData<T>[];
  csvColumns: Column<CSVData<T>>[];
}

const CSVUploadDatagrid = <T extends Record<string, unknown>>({
  csvData,
  csvColumns,
}: CSVUploadDatagridProps<T>) => {
  const { t } = useTranslation();
  const columns: Column<CSVData<T>>[] = [
    {
      columnName: t("pages.athleteImportPage.valid"),
      columnMapping(data) {
        return data.state === CSVUploadState.FAILED ? (
          <HoverTooltip
            text={t("components.tooltip.athleteUploadDatagrid.error")}
          >
            <CloseIcon color="error" style={IconProps} />
          </HoverTooltip>
        ) : data.state === CSVUploadState.LOADING ? (
          <HoverTooltip
            text={t("components.tooltip.athleteUploadDatagrid.loading")}
          >
            <CircularProgress size={"sm"} style={IconProps} />
          </HoverTooltip>
        ) : data.state === CSVUploadState.UPLOADED ? (
          <HoverTooltip
            text={t("components.tooltip.athleteUploadDatagrid.uploaded")}
          >
            <Cloud color="success" style={IconProps} />
          </HoverTooltip>
        ) : data.state === CSVUploadState.VALID ? (
          <HoverTooltip
            text={t("components.tooltip.athleteUploadDatagrid.valid")}
          >
            <UploadIcon style={IconProps} />
          </HoverTooltip>
        ) : (
          // Handle undefined `valid`
          <CloseIcon color="error" />
        );
      },
      size: "xs",
    },
    ...csvColumns,
  ];
  const mobileRendering: MobileTableRendering<CSVData<T>> = {};
  return (
    <GenericResponsiveDatagrid
      data={csvData}
      columns={columns}
      isLoading={false}
      keyOf={(item) =>
        Object.entries(item.data as Record<string, unknown>)
          .map(([key, value]) => `${key}:${value}`)
          .join(";")
      }
      mobileRendering={mobileRendering}
      disablePaging
    />
  );
};

export default CSVUploadDatagrid;
