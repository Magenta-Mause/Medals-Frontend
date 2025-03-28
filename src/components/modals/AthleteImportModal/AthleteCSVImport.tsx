import { Box, Button, Table, Typography } from "@mui/joy";
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
import { emailRegex, BirthdateRegex } from "@components/Regex/Regex";
import { Genders } from "@customTypes/enums";
import SyncIcon from "@mui/icons-material/Sync";

interface AthleteWithValidityToAthlete extends Athlete {
  valid: boolean | undefined;
  uploaded: boolean | undefined;
  failed: boolean | undefined;
}

interface ModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AthleteCSVImport = (props: ModalProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<AthleteWithValidityToAthlete[]>([]);
  const { checkAthleteExists } = useApi();
  const { createAthlete } = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const [isUploading, setIsUploading] = useState<boolean>(false);

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

  const stripValidity = (athlete: AthleteWithValidityToAthlete): Athlete => {
    const { ...athleteWithoutValid } = athlete;
    return athleteWithoutValid;
  };

  const checkEmptyImport = (athletes: AthleteWithValidityToAthlete[]) => {
    for (const athlete of athletes) {
      if (athlete.valid === true) {
        return false;
      }
    }
    return true;
  };

  const createAthletes = async (athletes: AthleteWithValidityToAthlete[]) => {
    setIsUploading(true);
    for (const athlete of athletes) {
      if (athlete.valid) {
        try {
          await createAthlete(stripValidity(athlete));
          athlete.uploaded = true;
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
        athlete.failed = true;
      }
    }
  };

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
    setIsUploading(false);
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
    const normalized = gender?.trim().toLowerCase();
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
                  valid: undefined,
                  uploaded: undefined,
                  failed: undefined,
                };
              }),
            );
            const athletesWithValidity = [];
            for (const athlete of parsedData) {
              athletesWithValidity.push({
                ...athlete,
                valid: await isValidImport(athlete),
                uploaded: undefined,
                failed: undefined,
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
        {selectedFile === null ? (
          <>
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
                  border: "2px",
                  borderColor: "neutral.outlinedBorder",
                  borderRadius: "md",
                  p: 4,
                  textAlign: "center",
                  width: { sx: "60vw", md: "40vw" },
                  height: { sx: "40vh", md: "30vh" },
                  cursor: "pointer",
                  bgcolor: "background.level1",
                  "&:hover": { bgcolor: "background.level2" },
                }}
              >
                <Typography
                  display="flex"
                  flexDirection="column"
                  textAlign={"center"}
                  justifyContent="center"
                  alignItems="center"
                  padding={9}
                  border={2}
                  borderColor="inherit"
                  borderRadius={"50px"}
                  sx={{
                    borderStyle: "dashed",
                    height: { sx: "25vh", md: "25vh" },
                  }}
                >
                  <UploadIcon fontSize="large" />
                  {t("pages.athleteImportPage.DropFile")}
                </Typography>
              </Box>
            </label>
          </>
        ) : (
          <>
            <Typography level="h4" sx={{ mb: 2 }}>
              {t("pages.athleteImportPage.athleteList")}
            </Typography>
            <Table borderAxis="bothBetween" stripe="odd" stickyHeader hoverRow>
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>
                    {t("pages.athleteImportPage.valid")}
                  </th>
                  <th>{t("pages.athleteImportPage.firstName")}</th>
                  <th>{t("pages.athleteImportPage.lastName")}</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((athlete, index) => (
                  <tr
                    key={index}
                    style={{
                      border: "10px solid", // Solid border
                      borderColor: athlete.uploaded
                        ? "green" // Fully opaque green border
                        : athlete.valid
                          ? "orange" // Fully opaque orange border
                          : "red", // Fully opaque red border
                      backgroundColor: athlete.uploaded
                        ? "rgba(0, 128, 0, 0.1)" // Green with 30% opacity
                        : athlete.valid
                          ? "rgba(255, 165, 0, 0.1)" // Orange (warning) with 30% opacity
                          : "rgba(255, 0, 0, 0.1)", // Red with 30% opacity
                    }}
                  >
                    <td>
                      {athlete.failed ? (
                        <CloseIcon color="error" />
                      ) : isUploading ? (
                        athlete.uploaded ? (
                          <UploadIcon color="success" />
                        ) : (
                          <SyncIcon
                            sx={{
                              animation: "spin 1s linear infinite",
                              "@keyframes spin": {
                                "0%": { transform: "rotate(0deg)" },
                                "100%": { transform: "rotate(-360deg)" },
                              },
                            }}
                          />
                        )
                      ) : (athlete.valid ?? false) ? ( // Handle undefined `valid`
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                    </td>
                    <td>{athlete.first_name}</td>
                    <td>{athlete.last_name}</td>
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
                  setIsUploading(false);
                }}
              >
                {t("pages.athleteImportPage.changeFile")}
              </Button>
              <Button
                sx={{ marginTop: "1vh" }}
                disabled={checkEmptyImport(csvData) || isUploading}
                onClick={() => {
                  createAthletes(csvData);
                }}
              >
                {t("pages.athleteImportPage.importButton")}
              </Button>
            </Box>
          </>
        )}
      </GenericModal>
    </>
  );
};
export default AthleteCSVImport;
