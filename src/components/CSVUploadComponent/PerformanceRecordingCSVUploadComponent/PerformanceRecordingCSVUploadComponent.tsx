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
import { MetricUnits } from "@customTypes/enums";
import { useTypedSelector } from "@stores/rootReducer";

interface PerformanceRecordingCSVUploadComponentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PerformanceRecordingCSVUploadComponent = ({
  setOpen,
}: PerformanceRecordingCSVUploadComponentProps) => {
  const { t } = useTranslation();
  const { createPerformanceRecording } = useApi();
  const { formatDate, formatValue } = useFormatting();

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

  const parsePerformanceRecordingCSV = (
    performanceRecordingData: Papa.ParseResult<unknown>,
  ) =>
    performanceRecordingData.data.map(
      (row: any) =>
        ({
          athlete_id: athletes.find(
            (athlete) =>
              athlete.first_name === row["Vorname"]?.trim() &&
              athlete.last_name === row["Nachname"]?.trim() &&
              athlete.gender === row["Geschlecht"]?.trim(),
          )?.id,
          rating_value: +row["Ergebnis"],
          discipline_id: disciplines.find(
            (discipline) =>
              discipline.name === row["Übung"] &&
              discipline.category === row["Kategorie"],
          )?.id,
          date_of_performance: +convertGermanTimeToAmerican(row["Datum"]),
        }) as PerformanceRecordingCreationDto,
    );

  const isValidPerformanceRecording = async (
    performanceRecordingDto: PerformanceRecordingCreationDto,
  ) => {
    const athlete = athletes.find(
      (athlete) => athlete.id === performanceRecordingDto.athlete_id,
    );
    const discipline = disciplines.find(
      (discipline) => discipline.id === performanceRecordingDto.discipline_id,
    );
    const performanceRecordingExists = performanceRecordings.find(
      (performanceRecording) =>
        performanceRecording.athlete_id ===
          performanceRecordingDto.athlete_id &&
        performanceRecording.rating_value ===
          performanceRecordingDto.rating_value &&
        performanceRecording.discipline_rating_metric.discipline.id ===
          performanceRecordingDto.discipline_id &&
        +getFullDay(new Date(performanceRecording.date_of_performance)) ===
          performanceRecordingDto.date_of_performance,
    );

    if (
      athlete &&
      discipline &&
      performanceRecordingDto.rating_value &&
      performanceRecordingDto.date_of_performance &&
      !performanceRecordingExists
    ) {
      return true;
    }

    return false;
  };

  return (
    <CSVUploadComponent
      key="performanceImport"
      setOpen={setOpen}
      parseCSVData={parsePerformanceRecordingCSV}
      uploadEntry={createPerformanceRecording}
      csvColumns={[
        {
          columnName: t("components.csvImportModal.firstName"),
          columnMapping(csvData: CSVData<PerformanceRecordingCreationDto>) {
            return (
              athletes.find((athlete) => athlete.id === csvData.data.athlete_id)
                ?.first_name ?? "Athlet nicht zugewiesen"
            );
          },
        },
        {
          columnName: t("components.csvImportModal.lastName"),
          columnMapping(csvData: CSVData<PerformanceRecordingCreationDto>) {
            return athletes.find(
              (athlete) => athlete.id === csvData.data.athlete_id,
            )?.last_name;
          },
        },
        {
          columnName: t("components.csvImportModal.discipline"),
          columnMapping(csvData: CSVData<PerformanceRecordingCreationDto>) {
            return disciplines.find(
              (discipline) => discipline.id === csvData.data.discipline_id,
            )?.name;
          },
        },
        {
          columnName: t("components.csvImportModal.performanceDate"),
          columnMapping(csvData: CSVData<PerformanceRecordingCreationDto>) {
            return formatDate(csvData.data.date_of_performance);
          },
        },
        {
          columnName: t("components.csvImportModal.performanceResult"),
          columnMapping(csvData: CSVData<PerformanceRecordingCreationDto>) {
            const disciplineUnit =
              disciplines.find(
                (discipline) => discipline.id === csvData.data.discipline_id,
              )?.unit ?? MetricUnits.POINTS;
            return formatValue(csvData.data.rating_value, disciplineUnit);
          },
        },
      ]}
      validateDataRow={isValidPerformanceRecording}
    />
  );
};

export default PerformanceRecordingCSVUploadComponent;
