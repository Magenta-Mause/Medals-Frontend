import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import AthletePerformanceAccordions from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import CreatePerformanceRecordingModal from "@components/modals/CreatePerformanceRecordingModal/CreatePerformanceRecordingModal";
import { Athlete } from "@customTypes/backendTypes";
import { Box, Button, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { IoIosCreate } from "react-icons/io";
import AthleteExportModal from "@components/modals/AthleteExportModal/AthleteExportModal";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import useAthleteLookup from "@hooks/useAthleteLookup";
import useApi from "@hooks/useApi";
import { enqueueSnackbar } from "notistack";

const AthletePerfomanceViewPage = () => {
    const { selectedUser } = useContext(AuthContext);
    const {getAthlete} =useApi();
    const [athlete, setAthlete] = useState<Athlete | null>(null);      
  const { t } = useTranslation();
  
  useEffect(() => {
    const fetchAthlete = async () => {
      if (!selectedUser) return;
  
      try {
        const data = await getAthlete(selectedUser.id.toString());
        if (data) {
          setAthlete(data);
        } else {
          enqueueSnackbar(t("snackbar.performanceMetrics.athleteNotFound"), {
            variant: "error",
          });
        }
      } catch (error) {
        enqueueSnackbar(t("snackbar.performanceMetrics.athleteFetchError"), {
          variant: "error",
        });
        console.error(error);
      }
    };
  
    fetchAthlete();
  }, [selectedUser, getAthlete]); 

if (!athlete) {
    return <Typography>{t("errors.noAthleteFound")}</Typography>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          alignItems: "flex-end",
        }}
      >
        <AthletePerformanceAccordions athlete={athlete} />
      </Box>
    </>
  );
};

export default AthletePerfomanceViewPage;

