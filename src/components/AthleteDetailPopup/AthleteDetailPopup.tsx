import { Athlete } from "@customTypes/bffTypes";
import { Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";

const AthleteDetailPopup = (props: {
  athlete: Athlete | null;
  open: boolean;
  setOpen: (newVal: boolean) => void;
}) => {
  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      sx={{
        left: {
          md: "var(--Sidebar-width)",
          sm: "0",
        },
      }}
    >
      <ModalDialog
        sx={{
          width: "1000px",
        }}
      >
        <ModalClose />
        <Typography level={"h2"}>
          {props.athlete?.first_name} {props.athlete?.last_name}
        </Typography>
      </ModalDialog>
    </Modal>
  );
};

export default AthleteDetailPopup;
