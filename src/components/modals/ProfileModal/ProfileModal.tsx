import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import ConfirmationPopup from "@components/ConfirmationPopup/ConfirmationPopup";
import useApi from "@hooks/useApi";
import { Avatar, Box, Button, Grid, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useMediaQuery } from "@uidotdev/usehooks";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import GenericModal from "../GenericModal";
import { UserType } from "@customTypes/enums";

const infoCardDesktop = ({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) => (
  <Box>
    <Grid
      container
      spacing={2}
      sx={{ textAlign: "left", alignItems: "center" }}
    >
      <Grid xs={6} sx={{ textAlign: "right" }}>
        <Typography fontWeight="bold" component="h2">
          {label}:
        </Typography>
      </Grid>
      <Grid xs={6} sx={{ textAlign: "left" }}>
        <Typography>{value}</Typography>
      </Grid>
    </Grid>
  </Box>
);

const infoCardMobile = ({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) => (
  <Box sx={{ textAlign: "center", alignItems: "center" }}>
    <Typography fontWeight="bold" component="h2">
      {label}: <br />
    </Typography>

    <Typography>{value}</Typography>
  </Box>
);

const ProfileModal = (props: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const { selectedUser, setSelectedUser } = useContext(AuthContext);
  const isMobile = useMediaQuery("(max-width:600px)");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const { deleteAthlete, deleteTrainer, deleteAdmin } = useApi();
  const selectedAthlete = athletes.find(
    (athlete: { id: number | undefined }) => athlete.id === selectedUser?.id,
  );

  const formattedDate = selectedAthlete?.birthdate
    ? new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(selectedAthlete.birthdate))
    : "Datum nicht verfügbar";

  const handleConfirmDelete = async () => {
    try {
      let success = undefined;
      if (selectedUser?.type === UserType.ATHLETE) {
        success = await deleteAthlete(selectedUser.id);
      } else if (selectedUser?.type === "TRAINER") {
        success = await deleteTrainer(selectedUser.id);
      } else if (selectedUser?.type === "ADMIN") {
        success = await deleteAdmin(selectedUser.id);
      }
      if (success) {
        setSelectedUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error while deleting profile", error);
    }
    setDeletePopupOpen(false);
  };

  const InfoCard = isMobile ? infoCardMobile : infoCardDesktop;

  return (
    <GenericModal
      open={props.isOpen}
      setOpen={props.setOpen}
      header={t("pages.profilePage.header")}
      modalDialogSX={{
        width: "500px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: "0 50px",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        <Avatar
          sx={{ width: 100, height: 100, margin: "0 auto", mb: 2, mt: 4 }}
        >
          <Typography sx={{ fontSize: "2rem" }}>
            {selectedUser?.first_name.charAt(0)}
            {selectedUser?.last_name.charAt(0)}
          </Typography>
        </Avatar>
        <Box>
          <Typography level="h3" gutterBottom sx={{ textAlign: "center" }}>
            {selectedUser?.first_name} {selectedUser?.last_name}
          </Typography>
          <InfoCard label="ID" value={selectedUser?.id} />

          {selectedUser?.type === UserType.ATHLETE && (
            <>
              <InfoCard
                label={t("pages.profilePage.birthdate")}
                value={formattedDate}
              />
              <InfoCard
                label={t("pages.profilePage.gender")}
                value={t("genders." + selectedAthlete?.gender)}
              />
            </>
          )}
          <InfoCard
            label={t("pages.profilePage.email")}
            value={selectedUser?.email}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { sx: "row" },
            gap: 2,
            mt: 6,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/resetPassword")}
            sx={{ width: { md: "150px", sx: "none" } }}
          >
            {t("pages.profilePage.resetPasswordButton")}
          </Button>

          <Button
            variant="outlined"
            color="danger"
            onClick={() => {
              setDeletePopupOpen(true);
            }}
            sx={{ width: { sx: "none", md: "150px" } }}
          >
            {t("pages.profilePage.deleteProfileButton")}
          </Button>
        </Box>
      </Box>

      <ConfirmationPopup
        open={isDeletePopupOpen}
        onClose={() => {
          setDeletePopupOpen(false);
        }}
        onConfirm={handleConfirmDelete}
        message={t("pages.profilePage.confirmDeleteMessage")}
      />
    </GenericModal>
  );
};

export default ProfileModal;
