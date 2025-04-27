import AdminsDatagrid from "@components/datagrids/EntityDatagrid/AdminsDatagrid/AdminsDatagrid";
import { Box, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";

const AdminsOverviewPage = () => {
  const admins = useTypedSelector((state) => state.admins.data);
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
          {t("pages.adminOverviewPage.header")}
        </Typography>
      </Box>
      <AdminsDatagrid admins={admins}/>
    </>
  );
};

export default AdminsOverviewPage;
