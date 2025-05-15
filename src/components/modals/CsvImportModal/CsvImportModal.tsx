import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Athlete } from "@customTypes/backendTypes";
import GenericModal from "../GenericModal";
import { CSVUploadState } from "@customTypes/enums";
import { Tab, Tabs } from "@mui/material";
import AthleteCSVUploadComponent from "@components/CSVUploadComponent/AthleteCSVUploadComponent/AthleteCSVUploadComponent";
import PerformanceRecordingCSVUploadComponent from "@components/CSVUploadComponent/PerformanceRecordingCSVUploadComponent/PerformanceRecordingCSVUploadComponent";

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
  const [selectedImportPage, setSelectedImportPage] = useState<importPage>(
    importPage.athleteImport,
  );

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
          textColor="inherit"
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
          <AthleteCSVUploadComponent setOpen={props.setOpen} />
        ) : (
          <PerformanceRecordingCSVUploadComponent setOpen={props.setOpen} />
        )}
      </GenericModal>
    </>
  );
};

export default CsvImportModal;
