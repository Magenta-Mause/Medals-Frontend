import { useTranslation } from "react-i18next";
import CSVUploadComponent, { CSVData } from "../CSVUploadComponent";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/backendTypes";
import { Genders } from "@customTypes/enums";
import { useCallback } from "react";
import { BirthdateRegex, emailRegex } from "@components/Regex/Regex";
import { convertDateFormat } from "@components/CSVUploadComponent/CSVUploadComponent";

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
  return (
    <CSVUploadComponent
      key="athleteImport"
      setOpen={setOpen}
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
  );
};

export default AthleteCSVUploadComponent;
