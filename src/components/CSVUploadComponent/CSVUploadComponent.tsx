import CSVUploadDatagrid from "@components/datagrids/CSVUploadDatagrid/CSVUploadDatagrid";
import Papa from "papaparse";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import CSVFileUploader from "@components/CSVFileUploader/CSVFileUploader";
import { useState } from "react";
import { CSVData } from "./CSVHelper";

interface CSVUploadComponentProps<T> {
  parseCSVData: (data: Papa.ParseResult<unknown>) => T[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uploadEntry: (data: T) => Promise<any>;
  csvColumns: Column<CSVData<T>>[];
  validateDataRow: (data: T) => Promise<boolean>;
  key: string;
}

const CSVUploadComponent = <T extends Record<string, unknown>>({
  parseCSVData,
  setOpen,
  uploadEntry,
  csvColumns,
  validateDataRow,
  key,
}: CSVUploadComponentProps<T>) => {
  const [csvData, setCsvData] = useState<CSVData<T>[]>([]);

  return (
    <>
      {csvData.length === 0 ? (
        <CSVFileUploader
          key={`${key}-upload-provider`}
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
        />
      )}
    </>
  );
};

export default CSVUploadComponent;
