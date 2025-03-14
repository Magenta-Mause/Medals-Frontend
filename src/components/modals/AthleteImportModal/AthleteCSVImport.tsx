import { Box, Button, Modal, Sheet, Table, Typography } from "@mui/joy";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/backendTypes";
import { useSnackbar } from "notistack";
import UploadIcon from "@mui/icons-material/Upload";
import GenericModal from "../GenericModal";

interface AthleteWithValidityToAthlete extends Athlete {
  valid: boolean | undefined;
}

const AthleteCSVImport = () => {
  const { t } = useTranslation();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<AthleteWithValidityToAthlete[]>([]);
  const { checkAthleteExists } = useApi();
  const { createAthlete } = useApi();
  const { enqueueSnackbar } = useSnackbar();

  const convertDateFormat = (dateStr: string) => {
    // Split the input date string into an array [dd, mm, yyyy]
    const [day, month, year] = dateStr.split(".");

    // Return the date in yyyy-mm-dd format
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const emailRegex = // eslint-disable-next-line no-control-regex
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/i;

  const BirthdateRegex = /^\d{4}-\d{2}-\d{2}$/;

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
    if (athlete.first_name === null && athlete.first_name === "") {
      return false;
    }
    if (athlete.last_name === null && athlete.last_name === "") {
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

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const stripValidity = (athlete: AthleteWithValidityToAthlete): Athlete => {
    const { ...athleteWithoutValid } = athlete;
    return athleteWithoutValid;
  };

  const createAthletes = async (athletes: AthleteWithValidityToAthlete[]) => {
    for (const athlete of athletes) {
      if (athlete.valid) {
        try {
          await createAthlete(stripValidity(athlete));
          enqueueSnackbar(
            t("pages.athleteImportPage.feedback1") +
              athlete.first_name +
              " " +
              athlete.last_name +
              t("pages.athleteImportPage.feedback2"),
            { variant: "success" },
          );
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
        await delay(500); // ⏳ Add 0.5-second delay between requests
      } else {
        enqueueSnackbar(
          t("pages.athleteImportPage.failedFeedback") +
            athlete.first_name +
            " " +
            athlete.last_name,
          { variant: "error" },
        );
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Check file extension OR MIME type
      if (file.name.endsWith(".csv") || file.type === "text/csv") {
        setSelectedFile(file);
        parseCSV(file);
      } else {
        enqueueSnackbar("Only CSV-files are allowed", {variant:"error"})
        event.target.value = "";
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
      parseCSV(file);
    } else {
      enqueueSnackbar("Only CSV-files are allowed", {variant:"error"})
    }
  };

  const normalizeGender = (gender: string | undefined): string => {
    if (!gender) return "";
    const normalized = gender.trim().toLowerCase();

    if (normalized === "m") return "MALE";
    if (normalized === "w") return "FEMALE";
    if (normalized === "d") return "DIVERSE";

    return "UNKNOWN"; // Default for unexpected values
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
                  valid: undefined,
                };
              }),
            );
            const athletesWithValidity = [];
            for (const athlete of parsedData) {
              athletesWithValidity.push({
                ...athlete,
                valid: await isValidImport(athlete),
              });
            }
            setCsvData(athletesWithValidity);
          };
          setData();
        },
      });
      reader.onerror = () => {
        enqueueSnackbar("error reading file", {variant:"error"})
      };
    };
  };
  return (
    <>
      <Button color="primary" onClick={() => setPopupOpen(true)}>
        {t("pages.athleteImportPage.importButton")}
      </Button>
      <GenericModal
      header={t("pages.athleteImportPage.importButton") }
      open={isPopupOpen}
      setOpen={setPopupOpen}
      modalDialogSX={{ minWidth: "30%" }}
    >
        {selectedFile === null ? (
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 1000,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <input
              type="file"
              id="file-upload"
              style={{ display: "none", justifyContent: "center" }}
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Box
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                sx={{
                  border: "2px dashed",
                  borderColor: "neutral.outlinedBorder",
                  borderRadius: "md",
                  p: 4,
                  textAlign: "center",
                  width: "40vw",
                  height: "20vh",
                  cursor: "pointer",
                  bgcolor: "background.level1",
                  "&:hover": { bgcolor: "background.level2" },
                }}
              >
                <Typography
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <UploadIcon fontSize="large" />
                  Drag & Drop a file here
                </Typography>
              </Box>
            </label>
          </Sheet>
        ) : (
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 1000,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Typography level="h4" sx={{ mb: 2 }}>
              Athlete List
            </Typography>
            <Table borderAxis="bothBetween" stripe="odd" stickyHeader hoverRow>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Valid</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((athlete, index) => (
                  <tr key={index}>
                    <td>{athlete.first_name}</td>
                    <td>{athlete.last_name}</td>
                    <td>
                      {athlete.valid ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Button
                sx={{ marginTop: "1vh" }}
                onClick={() => {
                  setSelectedFile(null);
                }}
              >
                upload other File
              </Button>
              <Button
                sx={{ marginTop: "1vh" }}
                onClick={() => {
                  createAthletes(csvData);
                  setCsvData([]);
                  setSelectedFile(null);
                  setPopupOpen(false);
                }}
              >
                import Athletes
              </Button>
            </Box>
          </Sheet>
        )}
      </GenericModal>
    </>
  );
};
export default AthleteCSVImport;
