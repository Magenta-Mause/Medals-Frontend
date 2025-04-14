import AthletePerformanceAccordions from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import { Athlete } from "@customTypes/backendTypes";
import { Box, Typography } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import useApi from "@hooks/useApi";
import { enqueueSnackbar } from "notistack";
import { UserType } from "@customTypes/enums";

const AthletePerfomanceViewPage = () => {
  const { selectedUser } = useContext(AuthContext);
  const { getAthlete } = useApi();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAthlete = async () => {
      if (!(selectedUser?.type === UserType.ATHLETE)) return;

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
  }, [selectedUser, getAthlete, t]);

  if (!athlete) {
    return;
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
        <AthletePerformanceAccordions athlete={athlete} selectedUserType={selectedUser?.type} />
      </Box>
    </>
  );
};

export default AthletePerfomanceViewPage;
