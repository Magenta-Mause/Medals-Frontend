import dayjs from "dayjs";

enum CSVUploadState {
  VALID,
  UPLOADED,
  FAILED,
  LOADING,
}

interface CSVData<T> {
  data: T;
  state: CSVUploadState;
}
const convertDateFormat = (dateStr: string) => {
  return dayjs(dateStr, "DD.MM.YYYY").format("YYYY-MM-DD");
};

export { convertDateFormat, CSVUploadState };
export type { CSVData };
