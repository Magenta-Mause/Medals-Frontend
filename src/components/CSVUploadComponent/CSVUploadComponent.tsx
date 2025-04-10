import { Box, Button, Typography } from "@mui/joy";
import { CSVUploadState } from "@customTypes/enums";
import CSVUploadDatagrid from "@components/datagrids/CSVUploadDatagrid/CSVUploadDatagrid";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import { useSnackbar } from "notistack";
import Papa from "papaparse";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";

interface CSVData<T> {
  data: T;
  state: CSVUploadState;
}

interface CSVUploadComponentProps<T> {
  parseCSVData: (data: Papa.ParseResult<unknown>) => T[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uploadEntry: (data: T) => Promise<any>;
  csvColumns: Column<CSVData<T>>[];
}

const CSVUploadComponent = <T extends Record<string, unknown>>({
  parseCSVData,
  setOpen,
  uploadEntry,
  csvColumns,
}: CSVUploadComponentProps<T>) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [csvData, setCsvData] = useState<CSVData<T>[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Check file extension OR MIME type
      checkValidFile(file);
    }
  };

  // TODO: enhance check -> check for content of the file not the file extension
  const checkValidFile = (file: File) => {
    if (file.name.endsWith(".csv") || file.type === "text/csv") {
      setSelectedFile(file);
      parseCSV(file);
    } else {
      enqueueSnackbar("Only CSV-files are allowed", { variant: "error" });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    checkValidFile(file);
  };

  const isFinished = useCallback(() => {
    return (
      csvData.reduce(
        (prev, data) => prev || data.state === CSVUploadState.LOADING,
        false,
      ) &&
      isBlocked &&
      csvData.reduce(
        (prev, data) => prev && data.state === CSVUploadState.FAILED,
        true,
      )
    );
  }, [csvData, isBlocked]);

  const checkEmptyImport = (csvData: CSVData<T>[]) => {
    for (const data of csvData) {
      if (data.state === CSVUploadState.VALID) {
        return false;
      }
    }
    return true;
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file, "utf-8");

    reader.onload = () => {
      const csv = reader.result as string;

      Papa.parse(csv, {
        header: true, // Use CSV headers as keys
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = parseCSVData(results);

          const setData = async () => {
            setCsvData(
              parsedData.map((row) => {
                return {
                  data: row,
                  state: CSVUploadState.LOADING,
                };
              }),
            );
          };
          setData();
        },
      });
    };
  };

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
          }
        } else {
          data.state = CSVUploadState.FAILED;
        }
      }
    },
    [enqueueSnackbar, uploadEntry, t],
  );

  return (
    <>
      {selectedFile === null ? (
        <>
          <input
            type="file"
            id="file-upload"
            style={{ display: "none", justifyContent: "center" }}
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Box
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              sx={{
                border: "2px",
                borderColor: "neutral.outlinedBorder",
                borderRadius: "md",
                p: 4,
                textAlign: "center",
                width: { sx: "60vw", md: "40vw" },
                height: { sx: "40vh", md: "30vh" },
                cursor: "pointer",
                bgcolor: "background.level1",
                "&:hover": { bgcolor: "background.level2" },
              }}
            >
              <Typography
                display="flex"
                flexDirection="column"
                textAlign={"center"}
                justifyContent="center"
                alignItems="center"
                padding={9}
                border={2}
                borderColor="inherit"
                borderRadius={"50px"}
                sx={{
                  borderStyle: "dashed",
                  height: { sx: "25vh", md: "25vh" },
                }}
              >
                <UploadIcon fontSize="large" />
                {t("pages.athleteImportPage.DropFile")}
              </Typography>
            </Box>
          </label>
        </>
      ) : (
        <>
          <Typography level="h4" sx={{ mb: 2 }}>
            {t("pages.athleteImportPage.athleteList")}
          </Typography>
          <CSVUploadDatagrid csvData={csvData} csvColumns={csvColumns} />
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
                setSelectedFile(null);
              }}
              color={"danger"}
            >
              {t("pages.athleteImportPage.changeFile")}
            </Button>
            <Button
              color={isFinished() ? "success" : "primary"}
              disabled={
                (checkEmptyImport(csvData) || isBlocked) && !isFinished()
              }
              onClick={() => {
                if (isFinished()) {
                  setSelectedFile(null);
                  setOpen(false);
                } else {
                  setIsBlocked(true);
                  uploadData(csvData);
                }
              }}
            >
              {isBlocked
                ? csvData.reduce(
                    (prev, csvData) =>
                      prev || csvData.state === CSVUploadState.LOADING,
                    false,
                  )
                  ? t("generic.loading")
                  : t("generic.finished")
                : t("pages.athleteImportPage.importButton")}
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default CSVUploadComponent;
export type { CSVData };
