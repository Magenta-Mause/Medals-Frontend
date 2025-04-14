import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/backendTypes";
import GenericModal from "../GenericModal";
import { CSVUploadState, Genders } from "@customTypes/enums";
import { Tab, Tabs } from "@mui/material";
import CSVUploadComponent, {
  CSVData,
} from "@components/CSVUploadComponent/CSVUploadComponent";
import { BirthdateRegex, emailRegex } from "@components/Regex/Regex";

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
  const { createAthlete, checkAthleteExists } = useApi();
  const [selectedImportPage, setSelectedImportPage] = useState<importPage>(
    importPage.athleteImport,
  );

  const convertDateFormat = (dateStr: string) => {
    // Split the input date string into an array [dd, mm, yyyy]
    const [day, month, year] = dateStr.split(".");

    // Return the date in yyyy-mm-dd format
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
    return athletesData.data.map((row: any) => ({
      first_name: row["Vorname"]?.trim() || "",
      last_name: row["Nachname"]?.trim() || "",
      email: row["E-Mail"]?.trim() || "",
      birthdate: convertDateFormat(row["Geburtsdatum"]?.trim()) || "",
      gender: normalizeGender(row["Geschlecht"]),
    }));
  };

  const checkIFAthleteExists = useCallback(
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
    const athleteExists = await checkIFAthleteExists(athlete);
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
            setOpen={props.setOpen}
            parseCSVData={parseAthleteCSV}
            uploadEntry={createAthlete}
            csvColumns={[
              {
                columnName: t("components.csvImportModal.lastName"),
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
        )}
      </GenericModal>
    </>
  );
};
export default CsvImportModal;
