import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import AthletePerformanceAccordions from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import CreatePerformanceRecordingModal from "@components/modals/CreatePerformanceRecordingModal/CreatePerformanceRecordingModal";
import { Athlete, DisciplineRatingMetric } from "@customTypes/backendTypes";
import { Box, Button, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { IoIosCreate } from "react-icons/io";
import AthleteExportModal from "@components/modals/AthleteExportModal/AthleteExportModal";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { UserType } from "@customTypes/enums";
import YearSelector from "@components/AthletePerformanceAccordions/YearSelector";

const AthleteDetailPage = () => {
  const { selectedUser } = useContext(AuthContext);
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
  const currentYear = new Date().getFullYear();
  const [selectedYear, setYear] = useState(currentYear);
  const disciplineRatingMetrics = useTypedSelector(
    (state) => state.disciplineMetrics.data,
  ) as DisciplineRatingMetric[];

  if (params.athleteId == "") {
    return <Typography>{t("errors.noAthleteIdSupplied")}</Typography>;
  }
  if (filteredAthletes.length == 0) {
    return <Typography>{t("errors.athleteNotFound")}</Typography>;
  }
  if (selectedUser?.type !== UserType.TRAINER) {
    return <Typography>{t("errors.accessNotAllowed")}</Typography>;
  }

  return (
    <>
      <AthleteDetailHeader athlete={filteredAthletes[0]} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          alignItems: "flex-end",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Box sx={{ justifyContent: "flex-start" }}>
            <YearSelector
              selectedYear={selectedYear}
              setYear={setYear}
              disciplineRatingMetrics={disciplineRatingMetrics}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={() => setPerformanceRecordingModalOpen(true)}
              sx={{
                width: 200,
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <IoIosCreate />
              {t("pages.athleteDetailPage.createPerformanceRecordingButton")}
            </Button>
            <AthleteExportModal
              isOpen={isExportModalOpen}
              setOpen={setExportModalOpen}
              selectedAthletes={filteredAthletes}
              includePerformance={true}
            />
          </Box>
        </Box>

        <AthletePerformanceAccordions
          athlete={filteredAthletes[0]}
          selectedUserType={selectedUser.type}
          selectedYear={selectedYear}
        />
      </Box>
      <CreatePerformanceRecordingModal
        open={isPerformanceRecordingModalOpen}
        setOpen={setPerformanceRecordingModalOpen}
        athlete={filteredAthletes[0]}
      />
    </>
  );
};

export default AthleteDetailPage;
