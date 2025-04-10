import { useState } from "react";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/backendTypes";
import { useSnackbar } from "notistack";
import GenericModal from "../GenericModal";
import { CSVUploadState, Genders } from "@customTypes/enums";
import { Tab, Tabs } from "@mui/material";
import CSVUploadComponent, {
  CSVData,
} from "@components/CSVUploadComponent/CSVUploadComponent";

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
  const { createAthlete } = useApi();
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

  return (
    <>
      <GenericModal
        header={t("pages.athleteImportPage.importButton")}
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
            label={t("pages.athleteImportPage.tabSelection.athleteImport")}
          />
          <Tab
            label={t("pages.athleteImportPage.tabSelection.performanceImport")}
          />
        </Tabs>
        {selectedImportPage === importPage.athleteImport ? (
          <CSVUploadComponent
            setOpen={props.setOpen}
            parseCSVData={parseAthleteCSV}
            uploadEntry={createAthlete}
            csvColumns={[
              {
                columnName: t("pages.athleteImportPage.firstName"),
                columnMapping(csvData: CSVData<Athlete>) {
                  return csvData.data.first_name;
                },
              },
              {
                columnName: t("pages.athleteImportPage.lastName"),
                columnMapping(csvData: CSVData<Athlete>) {
                  return csvData.data.last_name;
                },
              },
            ]}
          />
        ) : (
          <CSVUploadComponent
            setOpen={props.setOpen}
            parseCSVData={parseAthleteCSV}
            uploadEntry={createAthlete}
            csvColumns={[
              {
                columnName: t("pages.athleteImportPage.firstName"),
                columnMapping(csvData: CSVData<Athlete>) {
                  return csvData.data.first_name;
                },
              },
              {
                columnName: t("pages.athleteImportPage.lastName"),
                columnMapping(csvData: CSVData<Athlete>) {
                  return csvData.data.last_name;
                },
              },
            ]}
          />
        )}
      </GenericModal>
    </>
  );
};
export default CsvImportModal;
