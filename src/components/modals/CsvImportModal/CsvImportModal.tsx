import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import useApi from "@hooks/useApi";
import {
  Athlete,
  Discipline,
  PerformanceRecordingCreationDto,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import GenericModal from "../GenericModal";
import { CSVUploadState, Genders, MetricUnits } from "@customTypes/enums";
import { Tab, Tabs } from "@mui/material";
import CSVUploadComponent, {
  CSVData,
} from "@components/CSVUploadComponent/CSVUploadComponent";
import { BirthdateRegex, emailRegex } from "@components/Regex/Regex";
import { useTypedSelector } from "@stores/rootReducer";
import useFormatting from "@hooks/useFormatting";

export interface AthleteWithValidity extends Athlete {
  state: CSVUploadState | undefined;
}

interface AthleteCsvImportModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

enum importPage {
  athleteImport,
  performanceImport,
}

const CsvImportModal = (props: AthleteCsvImportModalProps) => {
  const { t } = useTranslation();
  const { createAthlete, checkAthleteExists, createPerformanceRecording } =
    useApi();
  const { formatDate, formatValue } = useFormatting();
  const [selectedImportPage, setSelectedImportPage] = useState<importPage>(
    importPage.athleteImport,
  );
  const athletes = useTypedSelector(
    (state) => state.athletes.data,
  ) as Athlete[];
  const disciplines = useTypedSelector(
    (state) => state.disciplines.data,
  ) as Discipline[];
  const performanceRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];

  const getFullDay = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const convertGermanTimeToAmerican = (timeStr: string) => {
    const [day, month, year] = timeStr.split(".").map(Number);
    return new Date(year, month - 1, day); // Month is 0-based
  };

  const convertDateFormat = (dateStr: string) => {
    const [day, month, year] = dateStr.split(".");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const normalizeGender = (gender: string | undefined) => {
    let normalized = "";
    if (gender?.trim().toLowerCase() === "m") {
      normalized = "MALE";
    }
    if (gender?.trim().toLowerCase() === "d") {
      normalized = "DIVERSE";
    }
    if (gender?.trim().toLowerCase() === "w") {
      normalized = "FEMALE";
    }
    return Genders[normalized as keyof typeof Genders];
  };

  const parseAthleteCSV = (athletesData: Papa.ParseResult<unknown>) => {
    return athletesData.data.map(
      (row: any) =>
        ({
          first_name: row["Vorname"]?.trim() || "",
          last_name: row["Nachname"]?.trim() || "",
          email: row["E-Mail"]?.trim() || "",
          birthdate: convertDateFormat(row["Geburtsdatum"]?.trim()) || "",
          gender: normalizeGender(row["Geschlecht"]),
        }) as Athlete,
    );
  };

  const checkIfAthleteExists = useCallback(
    async (athlete: Athlete) => {
      const result: boolean = await checkAthleteExists(
        athlete.email,
        athlete.birthdate,
      );
      return result;
    },
    [checkAthleteExists],
  );

  const isValidAthlete = async (athlete: Athlete) => {
    const athleteExists = await checkIfAthleteExists(athlete);
    if (
      athlete.first_name &&
      athlete.last_name &&
      athlete.gender &&
      emailRegex.test(athlete.email) &&
      BirthdateRegex.test(athlete.birthdate) &&
      ["DIVERSE", "MALE", "FEMALE"].includes(athlete.gender) &&
      !athleteExists // Athlete should not exist, while importing
    ) {
      return true;
    }

    return false;
  };

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

  return (
    <>
      <GenericModal
        header={t("components.csvImportModal.importButton")}
        open={props.isOpen}
        setOpen={(isOpen) => {
          props.setOpen(isOpen);
        }}
        modalDialogSX={{
          minWidth: "30%",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={selectedImportPage}
          onChange={(_event: React.SyntheticEvent, newSelectedPage: number) => {
            setSelectedImportPage(newSelectedPage);
          }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label={t("components.csvImportModal.tabSelection.athleteImport")}
          />
          <Tab
            label={t(
              "components.csvImportModal.tabSelection.performanceImport",
            )}
          />
        </Tabs>
        {selectedImportPage === importPage.athleteImport ? (
          <CSVUploadComponent
            key="athleteImport"
            setOpen={props.setOpen}
            parseCSVData={parseAthleteCSV}
            uploadEntry={createAthlete}
            csvColumns={[
              {
                columnName: t("components.csvImportModal.firstName"),
                columnMapping(csvData: CSVData<Athlete>) {
                  return csvData.data.first_name;
                },
              },
              {
                columnName: t("components.csvImportModal.lastName"),
                columnMapping(csvData: CSVData<Athlete>) {
                  return csvData.data.last_name;
                },
              },
            ]}
            validateDataRow={isValidAthlete}
          />
        ) : (
          <CSVUploadComponent
            key="performanceImport"
            setOpen={props.setOpen}
            parseCSVData={parsePerformanceRecordingCSV}
            uploadEntry={createPerformanceRecording}
            csvColumns={[
              {
                columnName: t("components.csvImportModal.firstName"),
                columnMapping(
                  csvData: CSVData<PerformanceRecordingCreationDto>,
                ) {
                  return athletes.find(
                    (athlete) => athlete.id === csvData.data.athlete_id,
                  )?.first_name;
                },
              },
              {
                columnName: t("components.csvImportModal.lastName"),
                columnMapping(
                  csvData: CSVData<PerformanceRecordingCreationDto>,
                ) {
                  return athletes.find(
                    (athlete) => athlete.id === csvData.data.athlete_id,
                  )?.last_name;
                },
              },
              {
                columnName: t("components.csvImportModal.discipline"),
                columnMapping(
                  csvData: CSVData<PerformanceRecordingCreationDto>,
                ) {
                  return disciplines.find(
                    (discipline) =>
                      discipline.id === csvData.data.discipline_id,
                  )?.name;
                },
              },
              {
                columnName: t("components.csvImportModal.performanceDate"),
                columnMapping(
                  csvData: CSVData<PerformanceRecordingCreationDto>,
                ) {
                  return formatDate(csvData.data.date_of_performance);
                },
              },
              {
                columnName: t("components.csvImportModal.performanceResult"),
                columnMapping(
                  csvData: CSVData<PerformanceRecordingCreationDto>,
                ) {
                  const disciplineUnit =
                    disciplines.find(
                      (discipline) =>
                        discipline.id === csvData.data.discipline_id,
                    )?.unit ?? MetricUnits.POINTS;
                  return formatValue(csvData.data.rating_value, disciplineUnit);
                },
              },
            ]}
            validateDataRow={isValidPerformanceRecording}
          />
        )}
      </GenericModal>
    </>
  );
};
export default CsvImportModal;
