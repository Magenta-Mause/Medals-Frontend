import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import AthletePerformanceAccordions from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import CreatePerformanceRecordingModal from "@components/modals/CreatePerformanceRecordingModal/CreatePerformanceRecordingModal";
import { Athlete } from "@customTypes/backendTypes";
import { Box, Button, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { IoIosCreate } from "react-icons/io";
import { IosShareRounded } from "@mui/icons-material";
import AthleteExportModal from "@components/modals/AthleteExportModal/AthleteExportModal";

const AthleteDetailPage = () => {
  const params = useParams();
  const { t } = useTranslation();
  const [isPerformanceRecordingModalOpen, setPerformanceRecordingModalOpen] =
    useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);

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
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          flexDirection: "column",
        }}
      >
        <Button
          variant="soft"
          onClick={() => setExportModalOpen(true)}
          sx={{ display: "flex", justifyContent: "space-around" }}
        >
          <IosShareRounded />
          {t("components.athleteExportModal.exportButton")}
        </Button>
      </Box>
      <AthleteDetailHeader athlete={filteredAthletes[0]} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          alignItems: "flex-end",
        }}
      >
        <Button
          onClick={() => setPerformanceRecordingModalOpen(true)}
          sx={{ width: 200, display: "flex", justifyContent: "space-around" }}
        >
          <IoIosCreate />
          {t("pages.athleteDetailPage.createPerformanceRecordingButton")}
        </Button>
        <AthletePerformanceAccordions athlete={filteredAthletes[0]} />
      </Box>
      <CreatePerformanceRecordingModal
        open={isPerformanceRecordingModalOpen}
        setOpen={setPerformanceRecordingModalOpen}
        athlete={filteredAthletes[0]}
      />
      <AthleteExportModal
        isOpen={isExportModalOpen}
        setOpen={setExportModalOpen}
        selectedAthletes={filteredAthletes}
        includePerformance={true}
      />
    </>
  );
};

export default AthleteDetailPage;
