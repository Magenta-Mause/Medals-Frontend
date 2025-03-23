import AthleteDatagrid from "@components/datagrids/AthleteDatagrid/AthleteDatagrid";
import { Box, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";
import AthleteCreationForm from "@components/modals/AthleteCreationModal/AthleteCreationModal";
import AthleteRequestButton from "@components/modals/AthleteRequestButton/AthleteRequestButton";

const AthleteOverviewPage = () => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const athleteState = useTypedSelector((state) => state.athletes.state);
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
          {t("pages.athleteOverviewPage.header")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            height: 100,
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <AthleteCreationForm />
          <AthleteRequestButton />
        </Box>
      </Box>
      <AthleteDatagrid
        athletes={athletes}
        isLoading={athleteState == "LOADING"}
      />
    </>
  );
};

export default AthleteOverviewPage;
