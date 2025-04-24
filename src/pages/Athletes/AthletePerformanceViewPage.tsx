import AthletePerformanceAccordions from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import { Athlete, DisciplineRatingMetric } from "@customTypes/backendTypes";
import { Box } from "@mui/joy";
import { useContext, useState } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { useTypedSelector } from "@stores/rootReducer";
import YearSelector from "@components/AthletePerformanceAccordions/YearSelector";
import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import SwimCertificateSection from "@components/SwimCertificateSection/SwimCertificateSection";

const AthletePerformanceViewPage = () => {
  const { selectedUser } = useContext(AuthContext);
  const athletes = useTypedSelector(
    (state) => state.athletes.data,
  ) as Athlete[];
  const athlete = athletes.filter(
    (athlete) => athlete.id === selectedUser!.id,
  )[0];
  const currentYear = new Date().getFullYear();
  const [selectedYear, setYear] = useState(currentYear);
  const disciplineRatingMetrics = useTypedSelector(
    (state) => state.disciplineMetrics.data,
  ) as DisciplineRatingMetric[];

  if (!athlete) {
    return <></>;
  }
  return (
    <>
      <AthleteDetailHeader athlete={athlete} />
      <SwimCertificateSection athlete={athlete} hideButton />
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

export default AthletePerformanceViewPage;
