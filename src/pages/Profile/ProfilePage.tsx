import AthleteDatagrid from "@components/Datagrids/AthleteDatagrid/AthleteDatagrid";
import { Box, Button, Card, CardContent, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";


const ProfilePage = () => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const athleteState = useTypedSelector((state) => state.athletes.state);
  const { selectedUser } = useContext(AuthContext);
  const selectedAthlete = athletes.find((athlete: { id: number | undefined; }) => athlete.id === selectedUser?.id);
  const { t } = useTranslation();
  
  const formattedDate = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(selectedAthlete?.birthdate));

  let gender = '';

  // Setze den Wert für gender abhängig vom Geschlecht
  //if (selectedAthlete?.gender === "MALE") {
    //gender = "männlich";
  //} else if (selectedAthlete?.gender === "FEMALE") {
    //gender = "weiblich";
  //} else if (selectedAthlete?.gender === "DIVERSE") {
   // gender = "divers";
  //}
  
  


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
        height: "100vh",
      }}>
        <Box sx={{ width: "100%", maxWidth: "350px" }}>
          <Typography level="h2" component="h1">
            {selectedUser?.first_name} {selectedUser?.last_name}
          </Typography>
          <Card variant="outlined">
            
            <CardContent>
              ID: {selectedUser?.id} <br />
              {t("pages.profilePage.birthdate")}: {formattedDate} <br />
              {t("pages.profilePage.gender")}: {t("genders." + selectedAthlete.gender)} <br />
              {t("pages.profilePage.email")}: {selectedUser?.email}
            </CardContent>
          </Card>
        </Box>

        {/* Buttons unter der Card */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Button variant="outlined">Reset Password</Button>
          <Button variant="outlined">Delete Profile</Button>
        </Box>
      </Box>   
    </>
  );
};

export default ProfilePage;
