import { Box, Typography } from "@mui/joy";
import UploadIcon from "@mui/icons-material/Upload";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import {
  CSVData,
  CSVUploadState,
} from "@components/CSVUploadComponent/CSVHelper";

interface CSVUploadProviderProps<T> {
  parseCSVData: (data: Papa.ParseResult<unknown>) => T[];
  validateDataRow: (data: T) => Promise<boolean>;
  setCsvData: React.Dispatch<React.SetStateAction<CSVData<T>[]>>;
}

const CSVFileUploader = <T extends Record<string, unknown>>({
  parseCSVData,
  validateDataRow,
  setCsvData,
}: CSVUploadProviderProps<T>) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const checkValidFile = (file: File) => {
    if (file.name.endsWith(".csv") || file.type === "text/csv") {
      parseCSV(file);
    } else {
      enqueueSnackbar(t("components.csvUploadComponent.invalidFileType"), {
        variant: "error",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Check file extension OR MIME type
      checkValidFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    checkValidFile(file);
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
            const mappedData = await Promise.all(
              parsedData.map(async (row) => {
                return {
                  data: row,
                  state: (await validateDataRow(row))
                    ? CSVUploadState.VALID
                    : CSVUploadState.FAILED,
                };
              }),
            );
            setCsvData(mappedData);
          };
          setData();
        },
      });
    };
  };

  return (
    <>
      <input
        type="file"
        id="file-upload"
        style={{
          position: "absolute",
          width: "100%",
          height: "20%",
          opacity: 0,
          cursor: "pointer",
          zIndex: 1,
          bottom: 0,
          left: 0,
          pointerEvents: "none",
          background: "var(--joy-palette-background-level1)",
        }}
        alt={"upload your csv file here"}
        onChange={handleFileChange}
        tabIndex={0}
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
            {t("components.csvUploadComponent.DropFile")}
          </Typography>
        </Box>
      </label>
    </>
  );
};

export default CSVFileUploader;
