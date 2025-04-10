import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/backendTypes";
import { useSnackbar } from "notistack";
import GenericModal from "../GenericModal";
import { BirthdateRegex, emailRegex } from "@components/Regex/Regex";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<AthleteWithValidity[]>([]);
  const { checkAthleteExists } = useApi();
  const { createAthlete } = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [selectedImportPage, setSelectedImportPage] = useState<importPage>(
    importPage.athleteImport,
  );

  const convertDateFormat = (dateStr: string) => {
    // Split the input date string into an array [dd, mm, yyyy]
    const [day, month, year] = dateStr.split(".");

    // Return the date in yyyy-mm-dd format
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const isValidEmail = (email: string) => emailRegex.test(email);
  const isValidBirthdate = (birthdate: string) =>
    BirthdateRegex.test(birthdate);

  const checkExists = useCallback(
    async (athlete: Athlete) => {
      const result: boolean = await checkAthleteExists(
        athlete.email,
        athlete.birthdate,
      );
      return result;
    },
    [checkAthleteExists],
  );

  const isValidImport = async (athlete: Athlete) => {
    if (!athlete.first_name) {
      return false;
    }
    if (!athlete.last_name) {
      return false;
    }
    if (!isValidEmail(athlete.email)) {
      return false;
    }
    if (!isValidBirthdate(athlete.birthdate)) {
      return false;
    }
    if (
      athlete.gender !== "DIVERSE" &&
      athlete.gender !== "MALE" &&
      athlete.gender !== "FEMALE"
    ) {
      return false;
    }
    return !(await checkExists(athlete));
  };

  const checkEmptyImport = (athletes: AthleteWithValidity[]) => {
    for (const athlete of athletes) {
      if (athlete.state === CSVUploadState.VALID) {
        return false;
      }
    }
    return true;
  };

  const uploadAthletes = useCallback(
    async (athletes: AthleteWithValidity[]) => {
      let index = 0;
      for (const athlete of athletes) {
        if (athlete.state === CSVUploadState.VALID) {
          athletes[index].state = CSVUploadState.LOADING;
          setCsvData([...athletes]);
          try {
            await createAthlete(athlete);
            athletes[index].state = CSVUploadState.UPLOADED;
            setCsvData([...athletes]);
          } catch (error: any) {
            console.log(error);
            enqueueSnackbar(
              t("pages.athleteImportPage.failedFeedback") +
                athlete.first_name +
                " " +
                athlete.last_name,
              { variant: "error" },
            );
          }
        } else {
          athlete.state = CSVUploadState.FAILED;
        }
        index += 1;
      }
    },
    [setCsvData, createAthlete, enqueueSnackbar, t],
  );

  const checkValidFile = (file: File) => {
    if (file.name.endsWith(".csv") || file.type === "text/csv") {
      setSelectedFile(file);
      parseCSV(file);
    } else {
      enqueueSnackbar("Only CSV-files are allowed", { variant: "error" });
    }
  };

  const handleModalClose = () => {
    setSelectedFile(null);
    setIsBlocked(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Check file extension OR MIME type
      checkValidFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    checkValidFile(file);
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

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file, "utf-8"); // Ensures correct encoding (fixes special characters)

    reader.onload = () => {
      const csv = reader.result as string;

      Papa.parse(csv, {
        header: true, // Use CSV headers as keys
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData: Athlete[] = result.data.map((row: any) => ({
            first_name: row["Vorname"]?.trim() || "",
            last_name: row["Nachname"]?.trim() || "",
            email: row["E-Mail"]?.trim() || "",
            birthdate: convertDateFormat(row["Geburtsdatum"]?.trim()) || "",
            gender: normalizeGender(row["Geschlecht"]),
          }));
          const setData = async () => {
            setCsvData(
              parsedData.map((row: Athlete) => {
                return {
                  ...row,
                  state: CSVUploadState.LOADING,
                };
              }),
            );

            const athletesWithValidity = [];

            for (const athlete of parsedData) {
              athletesWithValidity.push({
                ...athlete,
                state: (await isValidImport(athlete))
                  ? CSVUploadState.VALID
                  : CSVUploadState.FAILED,
              });
            }
            setCsvData(athletesWithValidity);
          };
          setData();
        },
      });
      reader.onerror = () => {
        enqueueSnackbar("error reading file", { variant: "error" });
      };
    };
  };

  const isFinished = useCallback(() => {
    return (
      !csvData.reduce(
        (prev, athlete) => prev || athlete.state === CSVUploadState.LOADING,
        false,
      ) &&
      isBlocked &&
      !csvData.reduce(
        (prev, athlete) => prev && athlete.state === CSVUploadState.FAILED,
        true,
      )
    );
  }, [csvData, isBlocked]);

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
          if (!isOpen) {
            handleModalClose();
          }
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
