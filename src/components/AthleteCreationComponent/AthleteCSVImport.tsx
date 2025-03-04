import { Box, Button, Modal, Sheet, Typography } from "@mui/joy";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';



const AthleteCSVImport = () => {
  const { t } = useTranslation();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

   const  convertDateFormat = (dateStr: string)  => {
    // Split the input date string into an array [dd, mm, yyyy]
    const [day, month, year] = dateStr.split('.');
  
    // Return the date in yyyy-mm-dd format
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const emailRegex = // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/i;

  const BirthdateRegex = // eslint-disable-next-line no-control-regex
  /^\d{4}-\d{2}-\d{2}$/;

  const isValidEmail = (email: string) => emailRegex.test(email);
  const isValidBirthdate = (birthdate: string) => BirthdateRegex.test(birthdate);

  const isValidImport = (athlete: any) => {
    if(athlete.firstName === null && athlete.firstName === ""){
      return false;
    }
    if(athlete.lastName === null && athlete.lastName === ""){
      return false;
    }
    if(!isValidEmail(athlete.email)){
      return false;
    }
    if(!isValidBirthdate(athlete.birthDate)){
      return false;
    }
    if(athlete.gender !== "D" && athlete.gender !== "M" && athlete.gender !== "W"){
      return false;
    }
    return true;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[  0];
  
      // Check file extension OR MIME type
      if (file.name.endsWith(".csv") || file.type === "text/csv") {
        setSelectedFile(file);
        parseCSV(file);
      } else {
        alert("Only CSV files are allowed.");
        event.target.value = ""; // Clear the input
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
      alert("Only CSV files are allowed.");
    }
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
          console.log("Raw Parsed Data:", result.data); // Debugging

          const parsedData: any[] = result.data.map((row: any) => ({
            firstName: row["Vorname"]?.trim() || "",
            lastName: row["Nachname"]?.trim() || "",
            email: row["E-Mail"]?.trim() || "",
            birthDate: convertDateFormat(row["Geburtsdatum"]?.trim()) || "",
            gender: row["Geschlecht"]?.trim().toUpperCase() || "", // Normalize gender formatting
          }));
          console.log(parsedData)
          setCsvData(parsedData);
        },
        error: (error: Error) => {
          setError("Error parsing CSV file.");
          console.error(error);
        },
      });
    };

    reader.onerror = () => {
      setError("Error reading file.");
    };
  };

  return (
    <>
      <Button color="primary" onClick={() => setPopupOpen(true)}>
        {t("pages.athleteImportPage.importButton")}
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          left: {
            md: "var(--Sidebar-width)",
            sm: "0",
          },
        }}
      >
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
            <Button
              component="span"
              variant="solid"
              color="primary"
              fullWidth
              sx={{ marginBottom: "2vh" }}
            >
              Choose File
            </Button>
          </label>
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
            <Typography>Drag & Drop a file here</Typography>
            {selectedFile && (
              <Typography sx={{ mt: 2 }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
          </Box>
          <ul>
        {csvData.map((athlete, index) => (
          <li key={index}>
            <strong>{athlete.firstName} {athlete.lastName} {isValidImport(athlete)? <CheckIcon/> : <CloseIcon/>} </strong>
            
          </li>
        ))}
      </ul>
      <Button fullWidth> import Athletes</Button>
        </Sheet>
      </Modal>
    </>
  );
};
export default AthleteCSVImport;
