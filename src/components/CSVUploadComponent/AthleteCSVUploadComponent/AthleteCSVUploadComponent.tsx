import { useTranslation } from "react-i18next";
import CSVUploadComponent, { CSVData } from "../CSVUploadComponent";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/backendTypes";
import { AthleteExportColumn, Genders } from "@customTypes/enums";
import { useCallback, useState } from "react";
import { BirthdateRegex, emailRegex } from "constants/regex";
import { convertDateFormat } from "@components/CSVUploadComponent/CSVUploadComponent";
import { attributeToGermanHeader } from "@components/modals/AthleteExportModal/AthleteExportModal";
import Checkbox from "@mui/joy/Checkbox";

interface AthleteCSVUploadComponentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AthleteWithAccess extends Partial<Athlete> {
  access: boolean;
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
          first_name:
            row[
              attributeToGermanHeader[AthleteExportColumn.FirstName]
            ].trim() ?? undefined,
          last_name:
            row[attributeToGermanHeader[AthleteExportColumn.LastName]].trim() ??
            undefined,
          email:
            row[attributeToGermanHeader[AthleteExportColumn.Email]].trim() ??
            undefined,
          birthdate:
            convertDateFormat(
              row[attributeToGermanHeader[AthleteExportColumn.Birthdate]],
            ).trim() ?? undefined,
          gender:
            normalizeGender(
              row[attributeToGermanHeader[AthleteExportColumn.Gender]],
            ) ?? undefined,
          access: true,
        }) as AthleteWithAccess,
    );
  };

  const isValidAthlete = async (athlete: AthleteWithAccess) => {
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
      ["DIVERSE", "MALE", "FEMALE"].includes(athlete.gender) &&
      !athleteExists // Athlete should not exist, while importing
    ) {
      return true;
    }

    return false;
  };

  const handleChange = (athlete: AthleteWithAccess) => {
    if (athlete.access) {
      athlete.access = false;
    } else {
      athlete.access = true;
    }
  };

  return (
    <CSVUploadComponent
      key="athleteImport"
      setOpen={setOpen}
      parseCSVData={parseAthleteCSV}
      uploadEntry={
        (athlete: AthleteWithAccess) => createAthlete(athlete as Athlete) // at this point, athlete is already validated
      }
      csvColumns={[
        {
          columnName: t("components.csvImportModal.firstName"),
          columnMapping(csvData: CSVData<AthleteWithAccess>) {
            if (!csvData.data.first_name) {
              return t("components.csvImportModal.invalidFirstName");
            }
            return csvData.data.first_name;
          },
        },
        {
          columnName: t("components.csvImportModal.lastName"),
          columnMapping(csvData: CSVData<AthleteWithAccess>) {
            if (!csvData.data.last_name) {
              return t("components.csvImportModal.invalidLastName");
            }
            return csvData.data.last_name;
          },
        },
        {
          columnName: "Access?",
          columnMapping(csvData: CSVData<AthleteWithAccess>) {
            return (
              <Checkbox
                checked={csvData.data.access}
                onChange={() => handleChange(csvData.data)}
              />
            );
          },
        },
      ]}
      validateDataRow={isValidAthlete}
    />
  );
};

export default AthleteCSVUploadComponent;
