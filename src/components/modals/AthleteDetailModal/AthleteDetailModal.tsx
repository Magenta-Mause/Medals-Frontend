import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import AthletePerformanceAccordions from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import { Athlete } from "@customTypes/backendTypes";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";

const AthleteDetailModal = (props: {
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
          xs: "0",
        },
        marginTop: {
          md: 0,
          xs: 5,
        },
      }}
    >
      <ModalDialog
        sx={{
          width: "1000px",
          pt: 6,
          maxWidth: { md: "calc(90vw - var(--Sidebar-width))", xs: "90vw" },
          overflowY: "auto",
          height: { xs: "90vh", md: "80vh" },
        }}
      >
        <ModalClose />
        {props.athlete ? (
          <>
            <AthleteDetailHeader athlete={props.athlete} />
            <AthletePerformanceAccordions athlete={props.athlete} />
          </>
        ) : (
          <></>
        )}
      </ModalDialog>
    </Modal>
  );
};

export default AthleteDetailModal;
