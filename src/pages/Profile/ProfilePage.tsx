import AthleteDatagrid from "@components/Datagrids/AthleteDatagrid/AthleteDatagrid";
import { Box, Card, CardContent, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";


const ProfilePage = () => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const athleteState = useTypedSelector((state) => state.athletes.state);
  const { selectedUser } = useContext(AuthContext);
  const { t } = useTranslation();

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
              width: "100%",
              maxWidth: "350px",
              flexGrow: 1,
            }}
          >
        <Card variant="outlined">
          <CardContent>
            {selectedUser?.first_name} {selectedUser?.last_name} <br />
            ID: {selectedUser?.id} <br />
            Birthdate: {}
            Email: {selectedUser?.email}
          </CardContent>
        </Card>
      </Box>
      
    </>
  );
};

export default ProfilePage;
