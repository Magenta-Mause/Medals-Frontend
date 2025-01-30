import AthleteDatagrid from "@components/Datagrids/AthleteDatagrid/AthleteDatagrid";
import { Box, Button, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";
import AthleteCreationForm from "./AthleteCreationPage";
import React, {useState} from 'react'
import { useNavigate } from "react-router";

const AthleteOverviewPage = () => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const athleteState = useTypedSelector((state) => state.athletes.state);
  const { t } = useTranslation();
  const navigate = useNavigate();



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
          <Button   
          onClick={() => {
            navigate("/athletes/create");
          }}>
            {t("pages.athleteOverviewPage.createButton")}
          </Button>
      </Box>
      <AthleteDatagrid
        athletes={athletes}
        isLoading={athleteState == "LOADING"}
      />
    </>
  );
};

export default AthleteOverviewPage;
