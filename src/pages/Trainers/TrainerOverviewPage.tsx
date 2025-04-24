import TrainerDatagrid from "@components/datagrids/TrainerDatagrid/TrainerDatagrid";
import { Box, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";

const TrainerOverviewPage = () => {
  const trainers = useTypedSelector((state) => state.trainers.data);
  const { t } = useTranslation();

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
          {t("pages.trainerOverviewPage.header")}
        </Typography>
      </Box>
      <TrainerDatagrid trainers={trainers} />
    </>
  );
};

export default TrainerOverviewPage;
