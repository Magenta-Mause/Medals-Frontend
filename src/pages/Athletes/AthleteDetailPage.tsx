import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import AthletePerformanceAccordions from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import CreatePerformanceRecordingModal from "@components/modals/CreatePerformanceRecordingModal/CreatePerformanceRecordingModal";
import { Athlete } from "@customTypes/backendTypes";
import { Button, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useState } from "react";
import { useParams } from "react-router";

const AthleteDetailPage = () => {
  const params = useParams();
  const [isPerformanceRecordingModalOpen, setPerformanceRecordingModalOpen] =
    useState(false);
  const athletes = useTypedSelector(
    (state) => state.athletes.data,
  ) as Athlete[];
  const filteredAthletes = athletes.filter(
    (ath) => ath.id == parseInt(params.athleteId ?? ""),
  );
  if (params.athleteId == "") {
    return <Typography>Invalid Athlete ID</Typography>;
  }
  if (filteredAthletes.length == 0) {
    return <Typography>No matching </Typography>;
  }

  return (
    <>
      <AthleteDetailHeader athlete={filteredAthletes[0]} />
      <Button onClick={() => setPerformanceRecordingModalOpen(true)}>
        + Add performance
      </Button>
      <AthletePerformanceAccordions athlete={filteredAthletes[0]} />
      <CreatePerformanceRecordingModal
        open={isPerformanceRecordingModalOpen}
        setOpen={setPerformanceRecordingModalOpen}
        athlete={filteredAthletes[0]}
      />
    </>
  );
};

export default AthleteDetailPage;
