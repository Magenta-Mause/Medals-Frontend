import { useTranslation } from "react-i18next";
import CSVUploadComponent from "../CSVUploadComponent";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/backendTypes";
import { AthleteExportColumn, Genders } from "@customTypes/enums";
import { useCallback } from "react";
import { BirthdateRegex, emailRegex } from "constants/regex";
import {
  convertDateFormat,
  CSVData,
} from "@components/CSVUploadComponent/CSVHelper";

interface AthleteCSVUploadComponentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AthleteCSVUploadComponent = ({
  setOpen,
}: AthleteCSVUploadComponentProps) => {
  const { t } = useTranslation();
  const { createAthlete, checkAthleteExists } = useApi();

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

  const parseAthleteCSV = (athletesData: Papa.ParseResult<unknown>) => {
    return athletesData.data.map(
      (row: any) =>
        ({
          first_name: row[AthleteExportColumn.FirstName].trim() ?? undefined,
          last_name: row[AthleteExportColumn.LastName].trim() ?? undefined,
          email: row[AthleteExportColumn.Email].trim() ?? undefined,
          birthdate:
            convertDateFormat(row[AthleteExportColumn.Birthdate]).trim() ??
            undefined,
          gender: row[AthleteExportColumn.Gender] ?? undefined,
        }) as Partial<Athlete>,
    );
  };

  const isValidAthlete = async (athlete: Partial<Athlete>) => {
    if (
      !athlete.first_name ||
      !athlete.last_name ||
      !athlete.gender ||
      !athlete.email ||
      !athlete.birthdate
    ) {
      return false;
    }

    const checkedAthlete = athlete as Athlete;
    const athleteExists = await checkIfAthleteExists(checkedAthlete);

    if (
      emailRegex.test(athlete.email) &&
      BirthdateRegex.test(athlete.birthdate) &&
      Object.keys(Genders).includes(athlete.gender) &&
      !athleteExists // Athlete should not exist, while importing
    ) {
      return true;
    }

    return false;
  };

  return (
    <CSVUploadComponent
      key="athleteImport"
      setOpen={setOpen}
      parseCSVData={parseAthleteCSV}
      uploadEntry={
        (athlete: Partial<Athlete>) => createAthlete(athlete as Athlete) // at this point, athlete is already validated
      }
      csvColumns={[
        {
          columnName: t("components.csvImportModal.firstName"),
          columnMapping(csvData: CSVData<Partial<Athlete>>) {
            if (!csvData.data.first_name) {
              return t("components.csvImportModal.invalidFirstName");
            }
            return csvData.data.first_name;
          },
        },
        {
          columnName: t("components.csvImportModal.lastName"),
          columnMapping(csvData: CSVData<Partial<Athlete>>) {
            if (!csvData.data.last_name) {
              return t("components.csvImportModal.invalidLastName");
            }
            return csvData.data.last_name;
          },
        },
      ]}
      validateDataRow={isValidAthlete}
    />
  );
};

export default AthleteCSVUploadComponent;
