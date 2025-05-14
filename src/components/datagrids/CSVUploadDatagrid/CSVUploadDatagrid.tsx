import GenericResponsiveDatagrid from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, CircularProgress, Typography } from "@mui/joy";
import { Cloud } from "@mui/icons-material";
import UploadIcon from "@mui/icons-material/Upload";
import { CSVUploadState } from "@components/CSVUploadComponent/CSVHelper";
import HoverTooltip from "@components/HoverTooltip/HoverTooltip";
import { CSVData } from "@components/CSVUploadComponent/CSVHelper";
import { useSnackbar } from "notistack";
import { useCallback, useState, CSSProperties } from "react";

const IconProps: CSSProperties = {
  zIndex: 1,
};

interface CSVUploadDatagridProps<T> {
  csvData: CSVData<T>[];
  setCsvData: React.Dispatch<React.SetStateAction<CSVData<T>[]>>;
  csvColumns: Column<CSVData<T>>[];
  uploadEntry: (data: T) => Promise<any>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CSVUploadDatagrid = <T extends Record<string, unknown>>({
  csvData,
  setCsvData,
  csvColumns,
  uploadEntry,
  setOpen,
}: CSVUploadDatagridProps<T>) => {
  const { t } = useTranslation();
  const columns: Column<CSVData<T>>[] = [
    {
      columnName: t("components.csvUploadDatagrid.valid"),
      columnMapping(data) {
        return data.state === CSVUploadState.FAILED ? (
          <HoverTooltip text={t("components.tooltip.CSVUploadDatagrid.error")}>
            <CloseIcon color="error" style={IconProps} />
          </HoverTooltip>
        ) : data.state === CSVUploadState.LOADING ? (
          <HoverTooltip
            text={t("components.tooltip.CSVUploadDatagrid.loading")}
          >
            <CircularProgress size={"sm"} style={IconProps} />
          </HoverTooltip>
        ) : data.state === CSVUploadState.UPLOADED ? (
          <HoverTooltip
            text={t("components.tooltip.CSVUploadDatagrid.uploaded")}
          >
            <Cloud color="success" style={IconProps} />
          </HoverTooltip>
        ) : data.state === CSVUploadState.VALID ? (
          <HoverTooltip text={t("components.tooltip.CSVUploadDatagrid.valid")}>
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
  const { enqueueSnackbar } = useSnackbar();
  const [dataUploaded, setDataUploaded] = useState<boolean>(false);

  const isFinished = useCallback(() => {
    return (
      csvData.reduce(
        // No datapoint should be in LOADING state
        (prev, data) => prev && data.state !== CSVUploadState.LOADING,
        true,
      ) &&
      csvData.reduce(
        // Not every datapoint should be in FAILED state
        (prev, data) => prev || data.state !== CSVUploadState.FAILED,
        false,
      ) &&
      dataUploaded
    );
  }, [csvData, dataUploaded]);

  const uploadData = useCallback(
    async (csvData: CSVData<T>[]) => {
      for (const data of csvData) {
        if (data.state === CSVUploadState.VALID) {
          data.state = CSVUploadState.LOADING;
          try {
            await uploadEntry(data.data);
            data.state = CSVUploadState.UPLOADED;
          } catch (error: any) {
            console.log(error);
            enqueueSnackbar(t("components.csvUploadComponent.failedUpload"), {
              variant: "error",
            });
            data.state = CSVUploadState.FAILED;
          }
          setCsvData([...csvData]);
        } else {
          data.state = CSVUploadState.FAILED;
        }
      }
    },
    [enqueueSnackbar, uploadEntry, t, setCsvData],
  );

  const validCSVData = csvData.length !== 0;

  const checkEmptyImport = (csvData: CSVData<T>[]) => {
    for (const data of csvData) {
      if (data.state === CSVUploadState.VALID) {
        return false;
      }
    }
    return true;
  };

  return validCSVData ? (
    <>
      <Typography level="h4" sx={{ mb: 2 }}>
        {t("components.csvUploadComponent.athleteList")}
      </Typography>
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
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Button
          onClick={() => {
            setCsvData([]);
          }}
          color={"danger"}
        >
          {t("components.csvUploadComponent.changeFile")}
        </Button>
        <Button
          color={isFinished() ? "success" : "primary"}
          disabled={
            (checkEmptyImport(csvData) || dataUploaded) && !isFinished()
          }
          onClick={() => {
            if (isFinished()) {
              setCsvData([]);
              setOpen(false);
            } else {
              setDataUploaded(true);
              uploadData(csvData);
            }
          }}
        >
          {dataUploaded
            ? csvData.reduce(
                (prev, csvData) =>
                  prev || csvData.state === CSVUploadState.LOADING,
                false,
              )
              ? t("generic.loading")
              : t("generic.finished")
            : t("components.csvImportModal.importButton")}
        </Button>
      </Box>
    </>
  ) : (
    <Typography>{t("components.csvUploadDatagrid.noValidEntries")} </Typography>
  );
};

export default CSVUploadDatagrid;
