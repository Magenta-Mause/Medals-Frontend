import { CSVUploadState } from "@customTypes/enums";
import dayjs from "dayjs";

interface CSVData<T> {
  data: T;
  state: CSVUploadState;
}
const convertDateFormat = (dateStr: string) => {
  return dayjs(dateStr, "DD.MM.YYYY").format("YYYY-MM-DD");
};

export { convertDateFormat };
export type { CSVData };
