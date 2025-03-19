import { t } from "i18next";
import GenericModal from "../GenericModal";
import { Box, Button, Typography } from "@mui/joy";
import { Athlete } from "@customTypes/backendTypes";

const AthleteExportModal = (props: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  selectedAthletes: Athlete[];
}) => {
  return (
    <GenericModal
      open={props.isOpen}
      setOpen={props.setOpen}
      header={t("components.athleteExportModal.header")}
      modalDialogSX={{
        width: "500px",
      }}
    >
      <Box>
      <Box>
          {props.selectedAthletes.map((athlete) => (
            <Box key={athlete.id}>
              <Typography>{athlete.first_name} {athlete.last_name}</Typography>
            </Box>
          ))}
        </Box>
        <Button
          fullWidth
          color="primary"
          onClick={() => {
            
          }}
        >
          {t("components.athleteExportModal.exportButton")}
        </Button>
      </Box>
    </GenericModal>
  );
};

export default AthleteExportModal;
