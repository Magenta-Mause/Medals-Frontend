import { CSVUploadState } from "@customTypes/enums";
import CSVUploadDatagrid from "@components/datagrids/CSVUploadDatagrid/CSVUploadDatagrid";
import Papa from "papaparse";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import dayjs from "dayjs";
import CSVUploadProvider from "@components/CSVUploadProvider/CSVUploadProvider";
import { useState } from "react";

interface CSVData<T> {
  data: T;
  state: CSVUploadState;
}

interface CSVUploadComponentProps<T> {
  parseCSVData: (data: Papa.ParseResult<unknown>) => T[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uploadEntry: (data: T) => Promise<any>;
  csvColumns: Column<CSVData<T>>[];
  validateDataRow: (data: T) => Promise<boolean>;
  key: string;
}

const convertDateFormat = (dateStr: string) => {
  return dayjs(dateStr, "DD.MM.YYYY").format("YYYY-MM-DD");
};

const CSVUploadComponent = <T extends Record<string, unknown>>({
  parseCSVData,
  setOpen,
  uploadEntry,
  csvColumns,
  validateDataRow,
  key,
}: CSVUploadComponentProps<T>) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVData<T>[]>([]);

  return (
    <>
      {selectedFile === null ? (
        <CSVUploadProvider
          key={`${key}-upload-provider`}
          setSelectedFile={setSelectedFile}
          parseCSVData={parseCSVData}
          validateDataRow={validateDataRow}
          setCsvData={setCsvData}
        />
      ) : (
        <CSVUploadDatagrid
          key={`${key}-upload-datagrid`}
          csvData={csvData}
          setCsvData={setCsvData}
          csvColumns={csvColumns}
          uploadEntry={uploadEntry}
          setOpen={setOpen}
          setSelectedFile={setSelectedFile}
        />
      )}
    </>
  );
};

export default CSVUploadComponent;
export type { CSVData };
export { convertDateFormat };
