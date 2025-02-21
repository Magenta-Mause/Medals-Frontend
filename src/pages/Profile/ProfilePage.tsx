import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Avatar, Grid } from '@mui/joy';
import { useTypedSelector } from '@stores/rootReducer';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { AuthContext } from '@components/AuthenticationProvider/AuthenticationProvider';
import { useNavigate } from 'react-router';
import ConfirmationPopup from '@components/ConfirmationPopup/ConfirmationPopup';

const ProfilePage = () => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const { selectedUser } = useContext(AuthContext);
  const selectedAthlete = athletes.find((athlete: { id: number | undefined; }) => athlete.id === selectedUser?.id);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(selectedAthlete?.birthdate));

  const InfoCard = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
    <Box>
      <Grid container spacing={2} sx={{textAlign: "left", alignItems: "center"}}>
        <Grid xs={6} sx={{textAlign: "right"}}>
          <Typography fontWeight="bold" component="h2">
            {label}:
          </Typography>
        </Grid>
        <Grid xs={6} sx={{textAlign: "left"}}>
          <Typography>
            {value}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const handleConfirmDelete = () => {
    // Hier kannst du die Logik für das Löschen des Profils hinzufügen
    // Zum Beispiel: API-Aufruf zum Löschen des Profils
    console.log('Profil von wird gelöscht');
    setDeletePopupOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          {t("pages.profilePage.header")}
        </Typography>
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
          <Card
            variant="outlined"
            sx={{
              p:3,
              textAlign: "center",
              display: "flex",
              width: "fit-content",
              minWidth: "450px"
              
            }}>  
            <Avatar sx={{ width: 80, height: 80, margin: "0 auto", mb: 2 }}>
              {selectedUser?.first_name.charAt(0)} {selectedUser?.last_name.charAt(0)}
            </Avatar>
            <CardContent>
              <Typography level="h3" gutterBottom>
                {selectedUser?.first_name} {selectedUser?.last_name}
              </Typography>
              <InfoCard label="ID" value={selectedUser?.id} />
              <InfoCard label={t("pages.profilePage.birthdate")} value={formattedDate} />
              <InfoCard label={t("pages.profilePage.gender")} value={t("genders." + selectedAthlete.gender)} />
              <InfoCard label={t("pages.profilePage.email")} value={selectedUser?.email} />
            </CardContent>
          </Card>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Button 
            variant="outlined"
            onClick={() => navigate("/resetPassword")}>
            {t("pages.profilePage.resetPasswordButton")}
          </Button>
          <Button variant="outlined" color="danger" onClick={() => {setDeletePopupOpen(true)}}>
            {t("pages.profilePage.deleteProfileButton")}
          </Button>
        </Box>
      </Box>

      <ConfirmationPopup
        open={isDeletePopupOpen}
        onClose={() => {setDeletePopupOpen(false)}}
        onConfirm={handleConfirmDelete}
        message={t("pages.profilePage.confirmDeleteMessage")}
      />
    </>
  );
};

export default ProfilePage;
