import { Box, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";

const PerformanceMetricsOverviewPage = () => {
  const performanceMetrics = useTypedSelector((state) => state.performanceMetrics.data);
  const performanceMetricsState = useTypedSelector((state) => state.performanceMetrics.state);
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
          {t("pages.performanceMetricsPage.header")}
        </Typography>
      </Box>
    </>
  );
};

export default PerformanceMetricsOverviewPage;
