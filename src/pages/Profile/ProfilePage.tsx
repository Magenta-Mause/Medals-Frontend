import AthleteDatagrid from "@components/Datagrids/AthleteDatagrid/AthleteDatagrid";
import { Box, Button, Card, CardContent, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { Bolt } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router";
import ResetPasswordPage from "@pages/PasswordReset/PasswordResetPage";


const ProfilePage = () => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const athleteState = useTypedSelector((state) => state.athletes.state);
  const { selectedUser } = useContext(AuthContext);
  const selectedAthlete = athletes.find((athlete: { id: number | undefined; }) => athlete.id === selectedUser?.id);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const formattedDate = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(selectedAthlete?.birthdate));

  const InfoCard = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
    <Box sx={{ marginTop: '20px' }}>
      <Typography fontWeight="bold" component="h2" sx={{ lineHeight: 1, marginBottom: '5px' }}>
        {label}
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ lineHeight: 0.6 }}>{value}</Typography>
        </CardContent>
      </Card>
    </Box>
  );

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
          <Typography
            level="h3"
            component="h1"
            sx={{textAlign: "center"}}>
            {selectedUser?.first_name} {selectedUser?.last_name}
          </Typography>

          <Card
            variant="outlined"
            sx={{
              paddingTop: "0px",
              margin: "5px",
            }}>  
            <CardContent>
              <InfoCard label="ID" value={selectedUser?.id} />
              <InfoCard label={t("pages.profilePage.birthdate")} value={formattedDate} />
              <InfoCard label={t("pages.profilePage.gender")} value={t("genders." + selectedAthlete.gender)} />
              <InfoCard label={t("pages.profilePage.email")} value={selectedUser?.email} />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Button 
            variant="outlined"
            onClick={() => {
                  navigate("/resetPassword")}}>{t("pages.profilePage.resetPasswordButton")}</Button>
          <Button variant="outlined">Delete Profile</Button>
        </Box>
      </Box>   
    </>
  );
};

export default ProfilePage;
