import AthleteDatagrid from "@components/datagrids/AthleteDatagrid/AthleteDatagrid";
import AthleteCreationForm from "@components/modals/AthleteCreationModal/AthleteCreationModal";
import AthleteImportModal from "@components/modals/AthleteImportModal/AthleteImportModal";
import AthleteRequestButton from "@components/modals/AthleteRequestModal/AthleteRequestModal";
import { Box, Button, Typography, useTheme } from "@mui/joy";
import { useMediaQuery } from "@mui/material";
import { useTypedSelector } from "@stores/rootReducer";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import UploadIcon from "@mui/icons-material/Upload";
import { PersonAdd, PersonSearch } from "@mui/icons-material";


const AthleteOverviewPage = () => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const athleteState = useTypedSelector((state) => state.athletes.state);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [addImportModalOpen, setImportModalOpen] = useState(false);
   const [addAthleteRequestModalOpen, setAddAthleteRequestModalOpen] =
      useState(false);
    const [createAthletModalOpen, setCreateAthleteModalOpen] = useState(false);
  
  

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
        {isMobile? (
          <Box
          sx={{
            display: "flex",
            mb: 1,
            gap: 1,
          }}>
           <Button onClick={() => setImportModalOpen(true)}> <><UploadIcon />{t("pages.athleteImportPage.importButton")}</></Button>
           <Button onClick={() => setCreateAthleteModalOpen(true)}><><PersonAdd />{t("components.athleteDatagrid.table.toolbar.createAthlete.label")}</></Button>
           <Button onClick={() => setAddAthleteRequestModalOpen(true)}><><PersonSearch />{t("components.athleteDatagrid.table.toolbar.addAthlete.label")}</></Button>
          </Box>
        ): (null)}
       <AthleteImportModal
        isOpen={addImportModalOpen}
        setOpen={setImportModalOpen}
      />
      <AthleteCreationForm
        isOpen={createAthletModalOpen}
        setOpen={setCreateAthleteModalOpen}
      />
      <AthleteRequestButton
              isOpen={addAthleteRequestModalOpen}
              setOpen={setAddAthleteRequestModalOpen}
            />
      </Box>
      <AthleteDatagrid
        athletes={athletes}
        isLoading={athleteState == "LOADING"}
      />
    </>
  );
};

export default AthleteOverviewPage;
