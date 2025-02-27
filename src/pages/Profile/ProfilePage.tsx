import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
} from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { useNavigate } from "react-router";
import ConfirmationPopup from "@components/ConfirmationPopup/ConfirmationPopup";
import useApi from "@hooks/useApi";
import { useMediaQuery } from "@uidotdev/usehooks";

const ProfilePage = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const athletes = useTypedSelector((state) => state.athletes.data);
  const { selectedUser, setSelectedUser } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const { deleteAthlete, deleteTrainer, deleteAdmin } = useApi();
  const selectedAthlete = athletes.find(
    (athlete: { id: number | undefined }) => athlete.id === selectedUser?.id,
  );

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

  const formattedDate = selectedAthlete?.birthdate
    ? new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(selectedAthlete.birthdate))
    : "Datum nicht verfügbar";

  const labels = [
    "pages.profilePage.email",
    "pages.profilePage.birthdate",
    "pages.profilePage.gender",
  ];

  let longestLabel = "";
  let maxLength = 0;
  labels.forEach((label) => {
    const translatedLabel = t(label);
    if (translatedLabel.length > maxLength) {
      maxLength = translatedLabel.length;
      longestLabel = translatedLabel;
    }
  });

  const handleConfirmDelete = async () => {
    try {
      let success = undefined;
      if (selectedUser?.type === "ATHLETE") {
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
    <>
      <Box>
        <Box>
          <Typography level="h2" component="h1">
            {t("pages.profilePage.header")}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pb: 3,
            overflowY: "scroll",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              display: "flex",
              maxWidth: "100%",
              minWidth: isMobile
                ? "none"
                : `${Math.max(selectedUser?.email ? selectedUser.email.length * 23 : 100, longestLabel.length * 22)}px`,
              width: isMobile ? "100%" : "none",
            }}
          >
            <Avatar sx={{ width: 100, height: 100, margin: "0 auto", mb: 1 }}>
              <Typography sx={{ fontSize: "2rem" }}>
                {selectedUser?.first_name.charAt(0)}
                {selectedUser?.last_name.charAt(0)}
              </Typography>
            </Avatar>
            <CardContent>
              <Typography level="h3" gutterBottom>
                {selectedUser?.first_name} {selectedUser?.last_name}
              </Typography>
              <InfoCard label="ID" value={selectedUser?.id} />

              {selectedUser?.type === "ATHLETE" && (
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
            </CardContent>
          </Card>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/resetPassword")}
            >
              {t("pages.profilePage.resetPasswordButton")}
            </Button>
            <Button
              variant="outlined"
              color="danger"
              onClick={() => {
                setDeletePopupOpen(true);
              }}
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
      </Box>
    </>
  );
};

export default ProfilePage;
