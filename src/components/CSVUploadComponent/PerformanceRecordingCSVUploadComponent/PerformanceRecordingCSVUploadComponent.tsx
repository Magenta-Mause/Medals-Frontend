import useApi from "@hooks/useApi";
import CSVUploadComponent, { CSVData } from "../CSVUploadComponent";
import { useTranslation } from "react-i18next";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
  PerformanceRecordingCreationDto,
} from "@customTypes/backendTypes";
import useFormatting from "@hooks/useFormatting";
import { AthletePerformanceExportColumn } from "@customTypes/enums";
import { useTypedSelector } from "@stores/rootReducer";
import { convertDateFormat } from "@components/CSVUploadComponent/CSVUploadComponent";

interface PerformanceRecordingCSVUploadComponentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PerformanceRecordingCreationCSVDto extends Record<string, unknown> {
  firstName: string | undefined;
  lastName: string | undefined;
  discipline: Discipline | undefined;
  athlete: Athlete | undefined;
  dateOfPerformance: number | undefined;
  ratingValue: number | undefined;
}

const PerformanceRecordingCSVUploadComponent = ({
  setOpen,
}: PerformanceRecordingCSVUploadComponentProps) => {
  const { t } = useTranslation();
  const { createPerformanceRecording } = useApi();
  const { formatLocalizedDate, formatValue } = useFormatting();

  const athletes = useTypedSelector(
    (state) => state.athletes.data,
  ) as Athlete[];
  const disciplines = useTypedSelector(
    (state) => state.disciplines.data,
  ) as Discipline[];
  const performanceRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];

  const convertGermanTimeToAmerican = (timeStr: string) => {
    const [day, month, year] = timeStr.split(".").map(Number);
    return new Date(year, month - 1, day); // Month is 0-based
  };

  const getFullDay = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const parsePerformanceRecordingCSV = (data: Papa.ParseResult<unknown>) =>
    data.data.map(
      (row: any) =>
        ({
          firstName: row[AthletePerformanceExportColumn.FirstName],
          lastName: row[AthletePerformanceExportColumn.LastName],
          discipline: disciplines.find(
            (discipline) =>
              discipline.name ===
              row[AthletePerformanceExportColumn.Discipline],
          ),
          dateOfPerformance: +convertGermanTimeToAmerican(
            row[AthletePerformanceExportColumn.PerformanceDate],
          ),
          ratingValue: +row[AthletePerformanceExportColumn.Result],
          athlete: athletes.find(
            (athlete) =>
              athlete.email === row[AthletePerformanceExportColumn.Email] &&
              athlete.birthdate ===
                convertDateFormat(
                  row[AthletePerformanceExportColumn.Birthdate],
                ),
          ),
        }) as PerformanceRecordingCreationCSVDto,
    );

  const isValidPerformanceRecording = async (
    performanceRecordingCreationCSVDto: PerformanceRecordingCreationCSVDto,
  ) => {
    const performanceRecordingExists = performanceRecordings.find(
      (performanceRecording) =>
        performanceRecording.athlete_id ===
          performanceRecordingCreationCSVDto.athlete?.id &&
        performanceRecording.rating_value ===
          performanceRecordingCreationCSVDto.ratingValue &&
        performanceRecording.discipline_rating_metric.discipline.id ===
          performanceRecordingCreationCSVDto.discipline?.id &&
        +getFullDay(new Date(performanceRecording.date_of_performance)) ===
          performanceRecordingCreationCSVDto.dateOfPerformance,
    );

    if (
      performanceRecordingCreationCSVDto.athlete &&
      performanceRecordingCreationCSVDto.discipline &&
      performanceRecordingCreationCSVDto.ratingValue &&
      performanceRecordingCreationCSVDto.dateOfPerformance &&
      !performanceRecordingExists
    ) {
      return true;
    }
    return false;
  };

  const uploadPerformanceRecording = async (
    data: PerformanceRecordingCreationCSVDto,
  ) => {
    createPerformanceRecording({
      athlete_id: data.athlete!.id,
      discipline_id: data.discipline!.id,
      date_of_performance: +getFullDay(new Date(data.dateOfPerformance!)),
      rating_value: data.ratingValue,
    } as PerformanceRecordingCreationDto);
  };

  return (
    <CSVUploadComponent
      key="performanceImport"
      setOpen={setOpen}
      parseCSVData={parsePerformanceRecordingCSV}
      uploadEntry={uploadPerformanceRecording}
      csvColumns={[
        {
          columnName: t("components.csvImportModal.firstName"),
          columnMapping(csvData: CSVData<PerformanceRecordingCreationCSVDto>) {
            if (!csvData.data.athlete) {
              return t("components.csvImportModal.invalidFirstName");
            }
            return csvData.data.firstName;
          },
        },
        {
          columnName: t("components.csvImportModal.lastName"),
          columnMapping(csvData: CSVData<PerformanceRecordingCreationCSVDto>) {
            if (!csvData.data.athlete) {
              return t("components.csvImportModal.invalidLastName");
            }
            return csvData.data.lastName;
          },
        },
        {
          columnName: t("components.csvImportModal.discipline"),
          columnMapping(csvData: CSVData<PerformanceRecordingCreationCSVDto>) {
            if (!csvData.data.discipline) {
              return t("components.csvImportModal.invalidFirstName");
            }
            return csvData.data.discipline.name;
          },
        },
        {
          columnName: t("components.csvImportModal.performanceDate"),
          columnMapping(csvData: CSVData<PerformanceRecordingCreationCSVDto>) {
            if (!csvData.data.dateOfPerformance) {
              return t("components.csvImportModal.invalidPerformanceDate");
            }
            return formatLocalizedDate(csvData.data.dateOfPerformance);
          },
        },
        {
          columnName: t("components.csvImportModal.performanceResult"),
          columnMapping(csvData: CSVData<PerformanceRecordingCreationCSVDto>) {
            if (!csvData.data.ratingValue || !csvData.data.discipline) {
              return t("components.csvImportModal.invalidPerformanceResult");
            }
            return formatValue(
              csvData.data.ratingValue,
              csvData.data.discipline.unit,
            );
          },
        },
      ]}
      validateDataRow={isValidPerformanceRecording}
    />
  );
};

export default PerformanceRecordingCSVUploadComponent;
