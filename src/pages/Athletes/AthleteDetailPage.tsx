import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import AthletePerformanceAccordions from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import CreatePerformanceRecordingModal from "@components/modals/CreatePerformanceRecordingModal/CreatePerformanceRecordingModal";
import CreateSwimCertificateModal from "@components/modals/CreateSwimCertificateModal/CreateSwimCertificateModal";
import { Athlete } from "@customTypes/backendTypes";
import { Box, Button, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { IoIosCreate } from "react-icons/io";
import SwimCertificateSection from "@components/SwimCertificateSection/SwimCertificateSection";

const AthleteDetailPage = () => {
  const params = useParams();
  const { t } = useTranslation();
  const [isPerformanceRecordingModalOpen, setPerformanceRecordingModalOpen] =
    useState(false);
  const [isSwimCertificateModalOpen, setSwimCertificateModalOpen] =
    useState(false);
  const athletes = useTypedSelector(
    (state) => state.athletes.data,
  ) as Athlete[];
  const filteredAthletes = athletes.filter(
    (ath) => ath.id == parseInt(params.athleteId ?? ""),
  );
  if (params.athleteId == "") {
    return <Typography>{t("errors.noAthleteIdSupplied")}</Typography>;
  }
  if (filteredAthletes.length == 0) {
    return <Typography>{t("errors.athleteNotFound")}</Typography>;
  }

  return (
    <>
      <Box sx={{ pt: 5 }}></Box>
      <AthleteDetailHeader athlete={filteredAthletes[0]} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          alignItems: "flex-end",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            onClick={() => setPerformanceRecordingModalOpen(true)}
            sx={{ width: 185, display: "flex", justifyContent: "space-around" }}
          >
            <IoIosCreate />
            {t("pages.athleteDetailPage.createPerformanceRecordingButton")}
          </Button>
        </Box>
        <AthletePerformanceAccordions athlete={filteredAthletes[0]} />
        <SwimCertificateSection athlete={filteredAthletes[0]} />
      </Box>
      <CreatePerformanceRecordingModal
        open={isPerformanceRecordingModalOpen}
        setOpen={setPerformanceRecordingModalOpen}
        athlete={filteredAthletes[0]}
      />
      <CreateSwimCertificateModal
        open={isSwimCertificateModalOpen}
        setOpen={setSwimCertificateModalOpen}
        athleteId={filteredAthletes[0].id!}
      />
    </>
  );
};

export default AthleteDetailPage;
