import AthletePerformanceAccordions from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import { Athlete, DisciplineRatingMetric } from "@customTypes/backendTypes";
import { Box } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import useApi from "@hooks/useApi";
import { enqueueSnackbar } from "notistack";
import { UserType } from "@customTypes/enums";
import { useTypedSelector } from "@stores/rootReducer";
import YearSelector from "@components/AthletePerformanceAccordions/YearSelector";
import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";

const AthletePerfomanceViewPage = () => {
  const { selectedUser } = useContext(AuthContext);
  const { getAthlete } = useApi();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setYear] = useState(currentYear);
  const disciplineRatingMetrics = useTypedSelector(
    (state) => state.disciplineMetrics.data,
  ) as DisciplineRatingMetric[];

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
      <AthleteDetailHeader athlete={athlete} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "flex-end",
        }}
      >
        <Box
          sx={{ display: "flex", width: "100%", justifyContent: "flex-start" }}
        >
          <YearSelector
            selectedYear={selectedYear}
            setYear={setYear}
            disciplineRatingMetrics={disciplineRatingMetrics}
          />
        </Box>

        <AthletePerformanceAccordions
          athlete={athlete}
          selectedUserType={selectedUser!.type}
          selectedYear={selectedYear}
        />
      </Box>
    </>
  );
};

export default AthletePerfomanceViewPage;
