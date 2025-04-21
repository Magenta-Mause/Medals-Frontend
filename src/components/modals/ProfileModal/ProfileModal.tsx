import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import ConfirmationPopup from "@components/ConfirmationPopup/ConfirmationPopup";
import useApi from "@hooks/useApi";
import useFormatting from "@hooks/useFormatting";
import { Avatar, Box, Button, Grid, Typography } from "@mui/joy";
import { useMediaQuery } from "@uidotdev/usehooks";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import GenericModal from "../GenericModal";
import { UserType } from "@customTypes/enums";
import { useSnackbar } from "notistack";
import { Athlete } from "@customTypes/backendTypes";

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
  const { selectedUser, setSelectedUser, refreshIdentityToken } =
    useContext(AuthContext);
  const isMobile = useMediaQuery("(max-width:600px)");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const { deleteAthlete, deleteTrainer, deleteAdmin } = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const { formatLocalizedDate } = useFormatting();

  let birthdate = "";
  let genderLabel = undefined;

  if (selectedUser && selectedUser.type === UserType.ATHLETE) {
    const athleteData = selectedUser as unknown as Athlete;
    birthdate = athleteData.birthdate;
    genderLabel = athleteData.gender;
  }

  const handleConfirmDelete = async () => {
    try {
      let success = undefined;
      if (selectedUser?.type === UserType.ATHLETE) {
        success = await deleteAthlete(selectedUser.id);
      } else if (selectedUser?.type === UserType.TRAINER) {
        success = await deleteTrainer(selectedUser.id);
      } else if (selectedUser?.type === UserType.ADMIN) {
        success = await deleteAdmin(selectedUser.id);
      }

      if (success) {
        refreshIdentityToken();
        setSelectedUser(null);
        enqueueSnackbar(t("snackbar.profileModal.accountDeleted"), {
          variant: "success",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Error while deleting profile", error);
      enqueueSnackbar(t("snackbar.profileModal.deletionError"), {
        variant: "error",
      });
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
                value={formatLocalizedDate(birthdate)}
              />
              <InfoCard
                label={t("pages.profilePage.gender")}
                value={genderLabel}
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
