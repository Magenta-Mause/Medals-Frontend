import { useTranslation } from "react-i18next";
import CSVUploadComponent from "../CSVUploadComponent";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/backendTypes";
import { AthleteExportColumn, Genders } from "@customTypes/enums";
import { useCallback, useState } from "react";
import { BirthdateRegex, emailRegex } from "constants/regex";
import {
  convertDateFormat,
  CSVData,
} from "@components/CSVUploadComponent/CSVHelper";
import { Checkbox, Typography } from "@mui/joy";
import HoverTooltip from "@components/HoverTooltip/HoverTooltip";

const NiceFormattedText = (props: { text: string }) => {
  return (
    <HoverTooltip text={props.text}>
      <Typography noWrap>{props.text}</Typography>
    </HoverTooltip>
  );
};

interface AthleteCSVUploadComponentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AthleteCSVUploadComponent = ({
  setOpen,
}: AthleteCSVUploadComponentProps) => {
  const { t } = useTranslation();
  const { createAthlete, checkAthleteExists, requestAthlete } = useApi();
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

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

  const athleteToKey = (athlete: Partial<Athlete>) =>
    athlete.birthdate + (athlete.email ?? "");

  const handleChangeSelection = (athlete: Partial<Athlete>) => {
    setSelectedAthletes((prev) => {
      const key = athleteToKey(athlete);
      if (prev.includes(key)) {
        return prev.filter((val) => val != key);
      }
      return [...prev, key];
    });
  };

  const createCallback = useCallback(
    async (athlete: Athlete) => {
      const key = athleteToKey(athlete);
      const createdAthlete = await createAthlete(athlete as Athlete); // at this point, athlete is already validated
      if (selectedAthletes.includes(key)) {
        console.log("requesting pupsnase:", createdAthlete);
        requestAthlete(createdAthlete.id!);
      }
    },
    [selectedAthletes, requestAthlete],
  );

  return (
    <CSVUploadComponent
      key="athleteImport"
      setOpen={setOpen}
      parseCSVData={parseAthleteCSV}
      uploadEntry={(athlete: Partial<Athlete>) =>
        createCallback(athlete as Athlete)
      }
      csvColumns={[
        {
          columnName: t("components.csvImportModal.firstName"),
          columnMapping(csvData: CSVData<Partial<Athlete>>) {
            if (!csvData.data.first_name) {
              return (
                t("components.csvImportModal.invalidity") +
                " " +
                t("components.csvImportModal.firstName")
              );
            }
            return <NiceFormattedText text={csvData.data.first_name ?? ""} />;
          },
        },
        {
          columnName: t("components.csvImportModal.lastName"),
          columnMapping(csvData: CSVData<Partial<Athlete>>) {
            if (!csvData.data.last_name) {
              return (
                t("components.csvImportModal.invalidity") +
                " " +
                t("components.csvImportModal.lastName")
              );
            }
            return <NiceFormattedText text={csvData.data.last_name ?? ""} />;
          },
        },
        {
          columnName: t("components.csvImportModal.email"),
          columnMapping(csvData: CSVData<Partial<Athlete>>) {
            if (!csvData.data.email) {
              return (
                t("components.csvImportModal.invalidity") +
                " " +
                t("components.csvImportModal.email")
              );
            }
            return <NiceFormattedText text={csvData.data.email ?? ""} />;
          },
        },
        {
          columnName: t("components.csvImportModal.birthdate"),
          columnMapping(csvData: CSVData<Partial<Athlete>>) {
            if (!csvData.data.last_name) {
              return (
                t("components.csvImportModal.invalidity") +
                " " +
                t("components.csvImportModal.birthdate")
              );
            }
            return <NiceFormattedText text={csvData.data.birthdate ?? ""} />;
          },
        },
        {
          columnName: t("components.csvImportModal.access"),
          columnMapping(csvData: CSVData<Partial<Athlete>>) {
            return (
              <Checkbox
                checked={selectedAthletes.includes(athleteToKey(csvData.data))}
                onChange={() => {
                  handleChangeSelection(csvData.data);
                }}
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
